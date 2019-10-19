import { Elm } from './src/Main.elm';
import { SubscriptionClient } from "subscriptions-transport-ws";
import './style/style.css';

document.addEventListener('DOMContentLoaded', function () {
  const client = new SubscriptionClient(`ws://${window.location.host}/graphql`, { reconnect: true });

  const app = Elm.Main.init({
    node: document.getElementById('elm')
  });

  const subscriptions = {};

  app.ports.createSubscription.subscribe(subscription => {
    console.log(`Subscription created: ${subscription.id}`);

    if (subscriptions[subscription.id]) {
      subscriptions[subscription.id].unsubscribe();
    }

    subscriptions[subscription.id] = client.request({ query: subscription.subscription }).subscribe({
      next: data => app.ports.receiveSubscriptionData.send({ id: subscription.id, subscription: data }),
      error: console.error,
      complete: console.log
    })
  });

  // app.ports.cancelSubscription.subscribe(id => {
  //   console.log(`Subscription cancelled: ${id}`)
  //
  //   if (subscriptions[id]) {
  //     subscriptions[id].unsubscribe();
  //     delete subscriptions[id];
  //   }
  // });
});
