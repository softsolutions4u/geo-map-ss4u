<?php
/**
 * Widget
 * @package geo-map-ss4u
 */

// Block direct requests.
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

/**
 * Class for Geo Location Widget.
 * @package Geo-Widget
 */
class Geo_Map_Ss4u_Widget extends \WP_Widget {

	/**
	 * Contructor of this function
	 */
	function __construct() {

		parent::__construct(
			// Base ID of the widget.
			'geo_map_ss4u_widget',
			// Name of the widget.
			\__( 'Geo SS4U Map', 'ss4u' ),
			// Widget options.
			array(
				'description' => \__( 'To Search the places inside the selected radius', 'ss4u' ),
			)
		);
	}

	/**
	 * Widget form creation
	 * @param array $instance Instance.
	 */
	function form($instance) {

			// Check values.
		if ( $instance ) {
			$title = esc_attr( $instance['title'] );
		} else {
			$title = '';
		}
		?>

		<p>
			<label for="<?php echo esc_html_e( $this->get_field_id( 'title' ) ); ?>"><?php esc_html_e( 'Widget Title', 'wp_widget_plugin' ); ?></label>
			<input class="widefat" id="<?php echo esc_html_e( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_html_e( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_html_e( $title ); ?>" />
		</p>
		<?php
	}

	/**
	 * Update the value
	 * @param array New Instance.
	 * @param array Old Instance.
	 * @return string
	 */
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		// Fields.
		$instance['title']    = strip_tags( $new_instance['title'] );
		return $instance;
	}
	/**
	 * Widget
	 * @param string $args Arguments.
	 * @param array $instance Instance.
	 */
	function widget( $args, $instance ) {
		extract( $args );
		echo $before_widget;
		$title   = !empty($instance['title']) ? trim($instance['title']) : 'Search Places';
		echo $before_title . $title . $after_title;
		include( 'geo-map-ss4u-view.php' );
		echo $after_widget;
	}
}
