import Page from './Page.svelte';
import Header from './Header.svelte';
import MainX from './Main.svelte';
import Panel from './MainPanel.svelte';
import Table from './MainTable.svelte';
import Footer from './Footer.svelte';
import Drawer from './Drawer.svelte';

const Main = Object.assign(MainX, { Panel, Table });
export default Object.assign(Page, { Header, Main, Footer, Drawer });
