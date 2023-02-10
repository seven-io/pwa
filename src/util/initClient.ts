import SevenClient from 'sms77-client';
const pkg = require('../../package.json');

export default function initClient(apiKey: string): SevenClient {
    return new SevenClient(apiKey, pkg.seven.sentWith)
}