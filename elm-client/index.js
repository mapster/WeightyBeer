import { Elm } from './src/Main.elm';
import { SubscriptionClient } from "subscriptions-transport-ws";
import './style/style.css';

const gql = `
subscription {
  weightUpdated {
    id
    zero
    current
    percent
  }
}
`;

document.addEventListener('DOMContentLoaded', function () {
    const client = new SubscriptionClient('ws://localhost:8000/graphql', {reconnect: true});

    client.request({query: gql}).subscribe({
        next: (value) => console.log('received data: ', value),
        error: console.log,
        complete: console.log
    });

    const app = Elm.Main.init({
        node: document.getElementById('elm')
    });
});
