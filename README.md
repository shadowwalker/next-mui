# Material-UI for Next.js

Use [Material-UI](https://material-ui.com/) with [Next.js](https://nextjs.org/) server-side rendering app.

This plugin implement the method in these examples:

- [Material-UI nextjs-next-with-typescript](https://github.com/mui-org/material-ui/tree/next/examples/nextjs-next-with-typescript)
- [Material-UI nextjs-next](https://github.com/mui-org/material-ui/tree/next/examples/nextjs-next)
- [Material-UI nextjs](https://github.com/mui-org/material-ui/tree/next/examples/nextjs)

## Usage

### Add Dependencies

``` bash
yarn add next-mui @material-ui/core @material-ui/styles
```

### Custom App And Document

> Following examples are written in typescript, `next-mui` also works out of box in javascript as needed.

*pages/_app.tsx*

``` typescript
import { withMui } from 'next-mui'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import App from 'next/app'

const theme: ThemeOptions = {
  typography: {
    useNextVariants: true,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Microsoft YaHei',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif'
    ].join(',')
  }
}

export default withMui(theme)(App)

// theme parameter in withMui() is optional, 
// simply skip it to use default material-ui theme
//
// export default withMui()(App)
```

*pages/_document.tsx*

``` typescript
import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { MuiHead, MuiStyles } from 'next-mui'

export default class extends Document {
  static async getInitialProps(ctx) {
    const page = ctx.renderPage()

    return {
      ...page,
      styles: <MuiStyles />
    }
  }

  render() {
    return (
      <html lang='en' dir='ltr'>
        <Head>
          <MuiHead disableUserScalable/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
```

### Create Material-UI Styled Component / Page

If you are using Material-UI V4 (alpha) styling solution, temporarily you have to import `next-mui/bootstrap` before everything else. [More information](https://material-ui.com/css-in-js/basics/).

``` typescript
import 'next-mui/bootstrap'
// --- Post bootstrap ---
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'

const styles = {
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
}

type IProps = {
    // some props
} & WithStyles<typeof styles>

export default withStyles(styles)(({ classes }: IProps) => (
	<Button className={classes.root}>Higher-order component</Button>
))
```

## API

**withMui** higher order component

``` typescript
declare type WithMui = (Component: React.ComponentType) => React.ComponentType;
declare const withMui: (themeOptions?: ThemeOptions) => WithMui
```

**MuiHead**

Optional properties:

- fontIcons: boolean
  - Use font icons
- disableUserScalable: boolean
  - Disable user's ability to zoom in and out on the app

**MuiStyles**

(No API)



