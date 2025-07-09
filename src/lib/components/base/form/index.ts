/*
import iCheckbox from './iCheckbox.svelte';
import iCombobox from './iCombobox.svelte';
import iRadio from './iRadio.svelte';
import iSelect from './iSelect.svelte';
import iSlider from './iSlider.svelte';
import iSwitch from './iSwitch.svelte'; 
*/
import Form from './Form.svelte';
import iText from './iText.svelte';
import iNumberInteger from './iNumberInteger.svelte';
import iNumberDecimal from './iNumberDecimal.svelte';
import iDate from './iDate.svelte';
import iDateTime from './iDateTime.svelte';
import iSubmit from './iSubmit.svelte';
import Debug from './Debug.svelte';
import Message from './Message.svelte';

export default Object.assign(Form, { iText, iNumberInteger, iNumberDecimal, iDate, iDateTime, iSubmit, Debug, Message });
