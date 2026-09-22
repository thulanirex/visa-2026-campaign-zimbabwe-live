# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Draw configuration

Both demo and live modes load customers from `public/responseFinal.json`, imported from `Customers_202609222043.csv`. Only entries matching the requested status (1 for this draw) are eligible. `REACT_APP_USE_MOCK=true` simulates saving winners; `false` uses the existing API for saving winners and updating customer status. It never changes the customer list. Live API endpoints currently point to `http://localhost:3176`.

Configure the draw in the root `.env` file:

```env
REACT_APP_USE_MOCK=true
REACT_APP_TOTAL_WINNERS=14
REACT_APP_ONE_WINNER_PER_BANK=true
REACT_APP_UNIQUE_BANK_WINNERS=10
```

- `REACT_APP_TOTAL_WINNERS`: maximum number of winners. The draw stops at this count.
- `REACT_APP_ONE_WINNER_PER_BANK=true`: apply the unique-bank rule for the configured phase. Set `false` to allow repeat banks throughout.
- `REACT_APP_UNIQUE_BANK_WINNERS=all`: require different banks throughout.
- Set `REACT_APP_UNIQUE_BANK_WINNERS=10` to require different banks for winners 1-10 (indices 0-9). Winners 11-14 can come from any bank, including banks that already won. Change this number to configure the transition.
- Set `REACT_APP_UNIQUE_BANK_WINNERS=0` to allow repeat banks from the first draw.

Winners are selected randomly from eligible entries in every phase. Previously winning cards remain excluded throughout. All banks are handled automatically; no bank names are configured in code. The unique-bank setting is a count of winners, not a CSV row limit or an inclusive last index.

The current CSV contains 12 banks. With `all`, at most 12 winners can be selected even if the target is 14; the rule is never silently relaxed. To select 14, use a finite unique-bank count such as `10` or disable the bank limit.

Demo winner history resets on page reload. Restart `npm start` after changing `.env`. For Vercel or other production hosting, rebuild and redeploy after configuration changes. Vercel environment variables, when set, take precedence over `.env`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
