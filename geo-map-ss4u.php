<?php
/**
 * Plugin Name: Geo Map SS4U
 * Plugin URI: http://www.softsolutions4u.com
 * Description: Plugin for Location search within the certain radius limit
 * Author: Soft Solutions4U
 * Version: 1.0
 * Author URI: http://www.softsolutions4u.com
 * @package geo-map-ss4u
 */

define( 'GEO_SS4U_MAP_VERSION', '1.0' );
define( 'GEO_SS4U_MAP_URL', untrailingslashit( plugins_url( basename( plugin_dir_path( __FILE__ ) ), basename( __FILE__ ) ) ) );
/**
 * Main function to include the backend admin panel
 */
function geo_ss4u_admin() {
	include( 'includes/geo-map-ss4u-admin.php' );
}

/**
 * Update and add function for  admin action
 */
function geo_ss4u_admin_actions() {
	\add_options_page( 'Geo Location Search', 'Geo Location Search', 1, 'geo_ss4u_admin', 'geo_ss4u_admin' );
}
\add_action( 'admin_menu', 'geo_ss4u_admin_actions' );

/**
 * Function to get location boundary
 */
function geo_ss4u_getoptions() {
	include( 'includes/geo-map-ss4u-view.php' );
}

/**
 * Function to register the widget
 */
function geo_ss4u_register_widget() {
	include( 'includes/geo-map-ss4u-widget.php' );
	register_widget( 'Geo_Map_Ss4u_Widget' );
}
\add_action( 'widgets_init', 'geo_ss4u_register_widget' );

add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'add_action_links' );

/**
 * Embedding the action link[settings page] to the plugin page
 * @param string $links Links.
 * @return string
 */
function add_action_links($links) {
	$mylinks = array(
		'<a href="' . admin_url( 'options-general.php?page=geo_ss4u_admin' ) . '">Settings</a>',
	);
	return array_merge( $links, $mylinks );
}
/**
 * Getting the setting values
 * @return array
 */
function geo_ss4u_get_options() {
	return $geo_options = array(
	'south_bound'         => get_option( 'gms_south_bound' ),
	'west_bound'          => get_option( 'gms_west_bound' ),
	'north_bound'         => get_option( 'gms_north_bound' ),
	'east_bound'          => get_option( 'gms_east_bound' ),
	'max_radius'          => get_option( 'gms_search_radius' ),
	'train_station'		  => GEO_SS4U_MAP_URL . '/assets/images/train_marker.png',
	'bank'				  => GEO_SS4U_MAP_URL . '/assets/images/bank_marker.png',
	'hospital'			  => GEO_SS4U_MAP_URL . '/assets/images/hospital_marker.png',
	'bus_station'		  => GEO_SS4U_MAP_URL . '/assets/images/bus_marker.png',
	'default_marker_url'  => GEO_SS4U_MAP_URL . '/assets/images/default_marker.png',
	);
}

/**
 * Function to include the script
 */
function geo_ss4u_map_scripts() {
	wp_enqueue_script( 'gms-google-map', 'https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places&sensor=false', array(), false, true );
	wp_enqueue_script( 'gms-google-map-chosen', GEO_SS4U_MAP_URL . '/assets/js/chosen/jquery.chosen.js', array(), false, true );
	wp_register_script( 'gms-script', GEO_SS4U_MAP_URL . '/assets/js/gms-script.js', array( 'jquery' ), GEO_SS4U_MAP_VERSION, true );
	wp_enqueue_script( 'gms-script' );
	wp_localize_script( 'gms-script', 'objValues', geo_ss4u_get_options() );
}
add_action( 'wp_footer', 'geo_ss4u_map_scripts', 15 );

/**
 *  Function to include the styles
 */
function geo_ss4u_map_style() {
	if ( ! wp_style_is( 'style', 'registered' ) ) {
		wp_register_style( 'gms-style', GEO_SS4U_MAP_URL . '/assets/css/gms-style.css', array(), GEO_SS4U_MAP_VERSION );
		wp_enqueue_style( 'gms-style' );
		wp_register_style( 'gms-style-chosen', GEO_SS4U_MAP_URL . '/assets/js/chosen/chosen.css', array(), GEO_SS4U_MAP_VERSION );
		wp_enqueue_style( 'gms-style-chosen' );
	}
}
add_action( 'wp_footer', 'geo_ss4u_map_style', 15 );
