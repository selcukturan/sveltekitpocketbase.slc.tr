<script lang="ts">
	import { icons } from './icons.svelte';
</script>

<svg style="display: none; position: absolute; width: 0; height: 0; overflow: hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
	<symbol id={icons.home} viewBox="0 0 24 24">
		<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
		<path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
	</symbol>
	<symbol id={icons.chart_spline} viewBox="0 0 24 24">
		<path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" />
	</symbol>
	<symbol id={icons.square_code} viewBox="0 0 24 24">
		<path d="M10 9.5 8 12l2 2.5" /><path d="m14 9.5 2 2.5-2 2.5" /><rect width="18" height="18" x="3" y="3" rx="2" />
	</symbol>
	<symbol id={icons.grape} viewBox="0 0 24 24">
		<path d="M22 5V2l-5.89 5.89" />
		<circle cx="16.6" cy="15.89" r="3" />
		<circle cx="8.11" cy="7.4" r="3" />
		<circle cx="12.35" cy="11.65" r="3" />
		<circle cx="13.91" cy="5.85" r="3" />
		<circle cx="18.15" cy="10.09" r="3" />
		<circle cx="6.56" cy="13.2" r="3" />
		<circle cx="10.8" cy="17.44" r="3" />
		<circle cx="5" cy="19" r="3" />
	</symbol>
	<symbol id={icons.settings} viewBox="0 0 24 24">
		<path
			d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
		/>
		<circle cx="12" cy="12" r="3" />
	</symbol>
	<symbol id={icons.file} viewBox="0 0 24 24">
		<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
		<path d="M14 2v4a2 2 0 0 0 2 2h4" />
	</symbol>
	<symbol id={icons.file_symlink} viewBox="0 0 24 24">
		<path d="m10 18 3-3-3-3" />
		<path d="M14 2v4a2 2 0 0 0 2 2h4" />
		<path d="M4 11V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7" />
	</symbol>
	<symbol id={icons.user} viewBox="0 0 24 24">
		<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
		<circle cx="12" cy="7" r="4" />
	</symbol>
	<symbol id={icons.users} viewBox="0 0 24 24">
		<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
		<circle cx="9" cy="7" r="4" />
		<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
		<path d="M16 3.13a4 4 0 0 1 0 7.75" />
	</symbol>
	<symbol id={icons.chevron_left} viewBox="0 0 24 24">
		<path d="m15 18-6-6 6-6" />
	</symbol>
	<symbol id={icons.chevron_right} viewBox="0 0 24 24">
		<path d="m9 18 6-6-6-6" />
	</symbol>
	<symbol id={icons.chevron_down} viewBox="0 0 24 24">
		<path d="m6 9 6 6 6-6" />
	</symbol>
	<symbol id={icons.chevron_up} viewBox="0 0 24 24">
		<path d="m18 15-6-6-6 6" />
	</symbol>
	<symbol id={icons.panel_right_close} viewBox="0 0 24 24">
		<rect width="18" height="18" x="3" y="3" rx="2" />
		<path d="M15 3v18" />
		<path d="m8 9 3 3-3 3" />
	</symbol>
	<symbol id={icons.panel_right_open} viewBox="0 0 24 24">
		<rect width="18" height="18" x="3" y="3" rx="2" />
		<path d="M15 3v18" />
		<path d="m10 15-3-3 3-3" />
	</symbol>
	<symbol id={icons.close} viewBox="0 0 24 24">
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</symbol>
	<symbol id={icons.info} viewBox="0 0 24 24">
		<circle cx="12" cy="12" r="10" />
		<path d="M12 16v-4" />
		<path d="M12 8h.01" />
	</symbol>
	<symbol id={icons.circle_x} viewBox="0 0 24 24">
		<circle cx="12" cy="12" r="10" />
		<path d="m15 9-6 6" />
		<path d="m9 9 6 6" />
	</symbol>
	<symbol id={icons.circle_check} viewBox="0 0 24 24">
		<circle cx="12" cy="12" r="10" />
		<path d="m9 12 2 2 4-4" />
	</symbol>
	<symbol id={icons.circle_alert} viewBox="0 0 24 24">
		<circle cx="12" cy="12" r="10" />
		<line x1="12" x2="12" y1="8" y2="12" />
		<line x1="12" x2="12.01" y1="16" y2="16" />
	</symbol>
	<symbol id={icons.loader} viewBox="0 0 24 24">
		<path d="M12 2v4" />
		<path d="m16.2 7.8 2.9-2.9" />
		<path d="M18 12h4" />
		<path d="m16.2 16.2 2.9 2.9" />
		<path d="M12 18v4" />
		<path d="m4.9 19.1 2.9-2.9" />
		<path d="M2 12h4" />
		<path d="m4.9 4.9 2.9 2.9" />
	</symbol>
	<symbol id={icons.circle} viewBox="0 0 24 24">
		<circle cx="12" cy="12" r="10" />
	</symbol>
	<symbol id={icons.data_table} viewBox="0 0 24 24">
		<path d="M12 3v18" />
		<rect width="18" height="18" x="3" y="3" rx="2" />
		<path d="M3 9h18" />
		<path d="M3 15h18" />
	</symbol>
	<symbol id={icons.update} viewBox="0 0 24 24">
		<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path
			d="m15 5 4 4"
		/>
	</symbol>
	<symbol id={icons.delete} viewBox="0 0 24 24">
		<path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path
			d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
		/>
	</symbol>
	<symbol id={icons.view} viewBox="0 0 24 24">
		<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" />
	</symbol>
	<symbol id={icons.moon} viewBox="0 0 24 24">
		<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
	</symbol>
	<symbol id={icons.sun} viewBox="0 0 24 24">
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2" />
		<path d="M12 20v2" />
		<path d="m4.93 4.93 1.41 1.41" />
		<path d="m17.66 17.66 1.41 1.41" />
		<path d="M2 12h2" />
		<path d="M20 12h2" />
		<path d="m6.34 17.66-1.41 1.41" />
		<path d="m19.07 4.93-1.41 1.41" />
	</symbol>
	<symbol id={icons.lucide} viewBox="0 0 24 24">
		<path d="M12 18V5" />
		<path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
		<path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
		<path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
		<path d="M18 18a4 4 0 0 0 2-7.464" />
		<path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
		<path d="M6 18a4 4 0 0 1-2-7.464" />
		<path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
	</symbol>
</svg>
