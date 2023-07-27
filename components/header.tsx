import { FC, useState, useRef } from 'react';
import Head from "next/head";
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { PaletteMode, useTheme } from '@mui/material';
import Popover from "@mui/material/Popover";
import AppBar from "@mui/material/AppBar";
import Box from '@mui/material/Box';
import Toolbar from "@mui/material/Toolbar";
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LearnMenuComponent from "./MenuCat";

interface Props {
  mode: PaletteMode;
  onChange?: () => void;
}

declare var window: any;

const Web3 = require("web3");

const config = require("../blockchainapi/config");
var web3 = new Web3(Web3.givenProvider || 'https://testnet.infura.io');
const contracttokenContract = new web3.eth.Contract(config.token_abi, config.token_adresse);

/**
 * HeaderComponent is a component responsible for rendering the application's header.
 * It displays the navigation bar, categories, and user information.
 */
const HeaderComponent: FC<Props> = ({ mode, onChange }) => {
  const customTheme = useTheme();
  const [openedPopover, setOpenedPopover] = useState(false);

  const popoverAnchor = useRef(null);

  /**
   * Handle mouse enter event for the popover.
   */
  const popoverEnter = () => {
    setOpenedPopover(true);
  }

  /**
   * Handle mouse leave event for the popover.
   */
  const popoverLeave = () => {
    setOpenedPopover(false);
  }

  const [currentBalance, setBalance] = useState(0);
  const [currentAccount, setCurrentAccount] = useState('');

  /**
   * Check if the wallet is connected and available (e.g., Metamask).
   */
  const checkWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Metamask not detected.");
      return;
    } else {
      console.log("Wallet connected successfully.");
    }
  }

  /**
   * Handle wallet connection when the "ConnectWallet" button is clicked.
   */
  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Metamask not detected.");
      return;
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Wallet connected successfully.", accounts[0]);
      LoginButton(accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("An error occurred while connecting the wallet.", error);
    };
  }

  /**
   * Fetch and update the user's token balance.
   * @param account The user's Ethereum account address.
   */
  function LoginButton(account: any) {
    const getBalance = async () => {
      const balances = await contracttokenContract.methods.balanceOf(account).call();
      console.log("Your token balance: ", balances);
      return balances;
    }
    getBalance().then((res) => (setBalance(res / Math.pow(10, 18))));
  }

  /**
   * Render the "ConnectWallet" button.
   */
  const connectWalletButton = () => {
    return (
      <Link href=".">
        <button onClick={connectWalletHandler} className={styles.btn}>Connect Wallet</button>
      </Link>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  /**
   * Render user address and balance based on the string length.
   * @param string The current user account.
   */
  const Address = (string: any) => {
    if (string.length > 16) {
      return (
        <div className={styles.className_44d352}>
          User Address: {currentAccount.toString().slice(0, 5) + "...." + currentAccount.toString().slice(currentAccount.toString().length - 5, currentAccount.toString().length)}
          &nbsp; User Balance: {currentBalance.toString()}
        </div>
      )
    } else {
      return (
        <div className={styles.className_44d352}>
          User Address: Not Connected
        </div>
      )
    }
  }

  return (
    <>
      <Head>
        <title>Bank XYZ</title>
        <meta name="description" content="App to deposit and staking" />
        <meta name="viewport" content="width-device-width, initial-scale=1" />
        <link rel="icon" href="/prop.JPG" />
      </Head>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position='fixed'
          sx={{ zIndex: (theme: { zIndex: { drawer: number; }; }) => theme.zIndex.drawer + 1 }}
          style={{
            backgroundColor: customTheme.palette.background.paper,
            color: customTheme.palette.text.primary,
            backgroundImage: "linear-gradient(to bottom, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)"

          }}
        >
          <Toolbar>
            <Link href='/' passHref>
              <IconButton
                size='large'
                edge='start'
                color='inherit'
                aria-label='menu'
                sx={{ mr: 2 }}
              >
                <p className={styles.className_44d352}>Bank XYZ</p>

              </IconButton>

            </Link>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', width: 'auto' }}>
              <Typography
                onMouseEnter={popoverEnter}
                onMouseLeave={popoverLeave}
                style={{ cursor: 'pointer' }}
                className={styles.className_44d352}
                variant='h6'
                component='span'
                ref={popoverAnchor}
                aria-owns={openedPopover ? 'mouse-over-popover' : undefined}
                aria-haspopup='true'
              >
                Categories
                <KeyboardArrowDownIcon
                  color='action'
                  sx={{
                    verticalAlign: 'middle',
                    display: 'inline-flex',
                    marginRight: '20px',
                  }}
                />
              </Typography>
              <Popover
                container={popoverAnchor.current}
                id='mouse-over-popover'
                open={openedPopover}
                anchorEl={popoverAnchor.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{ paper: { onMouseEnter: popoverEnter, onMouseLeave: popoverLeave } }}
              >
                <LearnMenuComponent />
              </Popover>
              <Link href='/bank' passHref>
                <Typography
                  variant='h6'
                  style={{ cursor: 'pointer', marginRight: '20px' }}
                  className={styles.className_44d352}
                >
                  Deposit and Stake
                </Typography>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <main className={styles.main2}>
        <div className={styles.description}>

          <div>
            <a
              href="https://github.com/Souhail99"
              target="_blank"
              rel="noopener noreferrer"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;By{' '}

              <Image
                src="/prop.JPG"
                alt="For orin-trail"
                className={styles.vercelLogo}
                width={100}
                height={90}
                priority
              />
            </a>
          </div>
          <div className={styles.className_44d352}>
            &nbsp;{connectWalletButton()}&nbsp;&nbsp;
          </div>
          <br></br>
          {Address(currentAccount.toString())}
        </div>
      </main>
    </>
  );
};

export default HeaderComponent;
