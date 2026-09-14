import DrawerForm from './DrawerForm.svelte';
import Header from './Header.svelte';
import Content from './Content.svelte';
import Form from './Form.svelte';

const ContentX = Object.assign(Content, { Form });
export default Object.assign(DrawerForm, { Header, Content: ContentX });
