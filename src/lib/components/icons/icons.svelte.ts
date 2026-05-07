export const icons = {
	home: 'home',
	chart_spline: 'chart-spline',
	square_code: 'square-code',
	grape: 'grape',
	settings: 'settings',
	file: 'file',
	file_symlink: 'file-symlink',
	user: 'user',
	users: 'users',
	chevron_left: 'chevron-left',
	chevron_right: 'chevron-right',
	chevron_down: 'chevron-down',
	chevron_up: 'chevron-up',
	panel_right_close: 'panel-right-close',
	panel_right_open: 'panel-right-open',
	close: 'close',
	info: 'info',
	circle_x: 'circle-x',
	circle_check: 'circle-check',
	circle_alert: 'circle-alert',
	loader: 'loader',
	circle: 'circle',
	data_table: 'data-table',
	update: 'update',
	delete: 'delete',
	view: 'view',
	moon: 'moon',
	sun: 'sun',
	lucide: 'lucide'
} as const;
// ####################################### END TRANSLATIONS ######################################

export type IconKey = keyof typeof icons;
