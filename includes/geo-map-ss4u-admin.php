<?php
/**
 * Admin Panel
 * @package geo-map-ss4u
 */

$saveSetting = isset( $_POST['gms_hidden'] ) ? \wp_unslash( $_POST['gms_hidden'] ) : '';
if ( $saveSetting === 'Y' ) {
	$south_bound	= isset( $_POST['gms_south_bound'] )   ? \wp_unslash( $_POST['gms_south_bound'] )   : 0;
	$west_bound		= isset( $_POST['gms_west_bound'] )    ? \wp_unslash( $_POST['gms_west_bound'] )    : 0;
	$north_bound	= isset( $_POST['gms_north_bound'] )   ? \wp_unslash( $_POST['gms_north_bound'] )   : 0;
	$east_bound		= isset( $_POST['gms_east_bound'] )    ? \wp_unslash( $_POST['gms_east_bound'] )    : 0;
	$search_radius	= isset( $_POST['gms_search_radius'] ) ? \wp_unslash( $_POST['gms_search_radius'] ) : 0;

	update_option( 'gms_south_bound',    $south_bound );
	update_option( 'gms_west_bound',     $west_bound );
	update_option( 'gms_north_bound',    $north_bound );
	update_option( 'gms_east_bound',     $east_bound );
	update_option( 'gms_search_radius',  $search_radius );
	?>
	<div class="updated"><p><strong><?php esc_html_e( 'Options saved.' ); ?></strong></p></div>
	<?php
} else {
	$south_bound	= get_option( 'gms_south_bound' );
	$west_bound		= get_option( 'gms_west_bound' );
	$north_bound	= get_option( 'gms_north_bound' );
	$east_bound		= get_option( 'gms_east_bound' );
	$search_radius	= get_option( 'gms_search_radius' );
}
?>
<div class="wrap">
	<?php echo '<h2>' . __( 'Geo Location Search Options', 'gms_trdom' ) . '</h2>'; ?>
    <form name="gms_form" method="post" action="<?php echo str_replace( '%7E', '~', $_SERVER['REQUEST_URI'] ); ?>">
        <input type="hidden" name="gms_hidden" value="Y">
		<table class="form-table">
			<tbody>
				<tr>
					<th colspan="2">
						<label>
							<?php echo '<h3>' . __( 'Default location boundary settings', 'gms_trdom' ) . '</h3>'; ?>
						</label>
					</th>
				</tr>
				<tr>
					<th>
						<label>
							<?php esc_html_e( 'South boundary: ' ); ?>
						</label>
					</th>
					<td>
						<input type="text" name="gms_south_bound" value="<?php echo esc_html_e( $south_bound ); ?>" size="20"><?php esc_html_e( 'ex: 12.96721' ); ?>
					</td>
				</tr>
				<tr>
					<th>
						<label>
							<?php esc_html_e( 'West boundary: ' ); ?>
						</label>
					</th>
					<td>
						<input type="text" name="gms_west_bound" value="<?php echo esc_html_e( $west_bound ); ?>" size="20"><?php esc_html_e( 'ex: 80.184631' ); ?>
					</td>
				</tr>
				<tr>
					<th>
						<label>
							<?php esc_html_e( 'North boundary: ' ); ?>
						</label>
					</th>
					<td>
						<input type="text" name="gms_north_bound" value="<?php echo esc_html_e( $north_bound ); ?>" size="20"><?php esc_html_e( 'ex: 13.15132' ); ?>
					</td>
				</tr>
				<tr>
					<th>
						<label>
							<?php esc_html_e( 'East boundary: ' ); ?>
						</label>
					</th>
					<td>
						<input type="text" name="gms_east_bound" value="<?php echo esc_html_e( $east_bound ); ?>" size="20"><?php esc_html_e( 'ex: 80.30455' ); ?>
					</td>
				</tr>
				<tr>
					<th colspan="2">
						<label>
							<?php echo '<h3>' . __( 'Other settings', 'gms_trdom' ) . '</h3>'; ?>
						</label>
					</th>
				</tr>
				<tr>
					<th>
						<label>
							<?php esc_html_e( 'Maximum search radius(in KM): ' ); ?>
						</label>
					</th>
					<td>
						<input type="number" name="gms_search_radius" value="<?php echo esc_html_e( $search_radius ); ?>"><?php esc_html_e( 'ex: 25' ); ?>
					</td>
				</tr>
			</tbody>
		</table>
		<br />
		<p class="submit">
			<input type="submit" name="Submit" value="<?php esc_html_e( 'Update Options', 'gms_trdom' ) ?>" />
        </p>
    </form>
</div>
