import Page from './Page.svelte';
import HeaderX from './Header.svelte';
import HeaderTable from './HeaderTable.svelte';
import HeaderTitle from './HeaderTitle.svelte';
import MainX from './Main.svelte';
import Panel from './MainPanel.svelte';
import Table from './MainTable.svelte';
import Empty from './MainEmpty.svelte';
import Index from './MainIndex.svelte';
import Footer from './Footer.svelte';
import Drawer from './Drawer.svelte';

const Header = Object.assign(HeaderX, { Table: HeaderTable, Title: HeaderTitle });
const Main = Object.assign(MainX, { Panel, Table, Empty, Index });
export default Object.assign(Page, { Header, Main, Footer, Drawer });
