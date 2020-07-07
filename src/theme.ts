import {red} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';

export default createMuiTheme({
    palette: {
        primary: {
            main: '#00d46a',
        },
        secondary: {
            main: '#777777',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
    },
});