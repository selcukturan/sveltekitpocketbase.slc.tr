import Page from './Page.svelte';
import Header from './Header.svelte';
import MainX from './Main.svelte';
import Panel from './MainPanel.svelte';
import Footer from './Footer.svelte';

const Main = Object.assign(MainX, { Panel });
export default Object.assign(Page, { Header, Main, Footer });
