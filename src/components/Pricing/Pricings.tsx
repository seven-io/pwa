import React, {ChangeEvent, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import SevenClient, {CountryPricing, PricingResponse} from '@seven.io/api';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useTranslation} from 'react-i18next';
import Table from '@material-ui/core/Table';
import TextField, {TextFieldProps} from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import {LocalStore} from '../../util/LocalStore';
import {addSnackbar, setBackdrop, setNav} from '../../store/actions';
import {CountryFlag} from '../CountryFlag';
import {Pricing} from './Pricing';

const pkg = require('../../../package.json');

export const Pricings = () => {
    const {t} = useTranslation('pricing');
    const [country, setCountry] = useState<CountryPricing | null>(null);
    const dispatch = useDispatch();
    const [apiKey, setApiKey] = useState<string>('');
    const [pricing, setPricing] = useState<PricingResponse>();

    useEffect(() => {
        LocalStore.option<string>('apiKey').then(apiKey => {
            setApiKey(apiKey);

            if (!(apiKey || '').length) {
                dispatch(addSnackbar(t('common:pleaseSetApiKey')));

                dispatch(setNav('options'));

                return;
            }

            LocalStore.get('pricing').then(pricing => {
                setPricing(pricing);

                if (!pricing) {
                    getAndStore()
                        .then()
                        .catch(e => console.error(e));
                }
            });
        }).catch(e => console.error(e));
    });

    const getAndStore = async () => {
        dispatch(setBackdrop(true));
        const pricing = await (new SevenClient(apiKey as string, pkg.seven.sentWith))
            .pricing({format: 'json'}) as PricingResponse;
        dispatch(setBackdrop(false));

        await LocalStore.set('pricing', pricing);

        setPricing(pricing);
    };

    const populationFields: (keyof PricingResponse)[] = ['countCountries', 'countNetworks'];

    return <>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h1 style={{display: 'inline-flex'}}>{t('pricing')}</h1>

            <Button onClick={() => getAndStore()}>
                {t('reload')}
            </Button>^
        </div>

        <TableContainer style={{marginBottom: '2em'}}>
            <Table aria-label={t('ariaLabels.countryTable')} size='small'>
                <TableBody>

                    {pricing && populationFields.map((o, i) => <TableRow key={i}>
                        <TableCell component='th' scope='row'>
                            {t(o)}
                        </TableCell>

                        <TableCell align='right'>
                            {pricing[o]}
                        </TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>

        {pricing && <Autocomplete
            getOptionLabel={(o: CountryPricing) => `${o.countryCode} ${o.countryName} ${o.countryPrefix}`}
            onChange={(ev: ChangeEvent<{}>, cP: CountryPricing | null) => setCountry(cP)}
            options={pricing.countries}
            renderOption={(o: CountryPricing) => <>
                <CountryFlag
                    pricing={o}/>&nbsp;{` ${o.countryCode} ${o.countryName} ${o.countryPrefix}`}</>}
            renderInput={(params: TextFieldProps) => <TextField
                {...params}
                label={t('choose')}
                variant='outlined'
            />}
        />}

        {country && <Pricing pricing={country}/>}
    </>;
};
