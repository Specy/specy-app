import MdCoffee from '~icons/mdi/coffee';
import FaPaypal from '~icons/fa-brands/paypal';
import FaGithub from '~icons/fa-brands/github';

/** Where to donate, shared by the donate page and the support section of the hub */
export const donations = [
    {
        label: 'Ko-fi',
        action: 'Donate on Ko-fi',
        url: 'https://ko-fi.com/specy',
        icon: MdCoffee,
    },
    {
        label: 'PayPal',
        action: 'Donate with PayPal',
        url: 'https://paypal.me/specyDev',
        icon: FaPaypal,
    },
    {
        label: 'GitHub Sponsors',
        action: 'Sponsor on GitHub',
        url: 'https://github.com/sponsors/Specy',
        icon: FaGithub,
    },
];
