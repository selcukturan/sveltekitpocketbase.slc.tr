import DrawerForm from './DrawerForm.svelte';
import Header from './Header.svelte';
import ContentX from './Content.svelte';
import Form from './Form.svelte';

const Content = Object.assign(ContentX, { Form });
export default Object.assign(DrawerForm, { Header, Content });
