<div id="gs-content" class="gs-full-width">
    <div id="gs-fields-block" class="gs-full-width">
        <input class='gs-full-width' id="autocomplete" placeholder="Enter your search term" type="text" />
		<div id="gs-fields-block" class="gs-full-width">
			<p>Search nearby train stations within</p>
		</div>
        <div class="gs-full-width" id="gs-radius-block">
            <select id="radius-level">
				<?php
				/**
				 * Radius Dropdown
				 * @package geo-map-ss4u
				 */

				$minimumRadius = 1;
				for ( $currentRadius = $minimumRadius; $currentRadius <= get_option( 'gms_search_radius' ); $currentRadius++ ) { ?>
					<option value="<?php echo esc_html_e( $currentRadius ); ?>"><?php echo esc_html_e( $currentRadius ); ?></option>
				<?php }
				?>
            </select>
            <p>Km Radius</p>
        </div>
        <button type="button" name="searchbutton" id="searchbutton" >Search</button>
    </div>
    <div id="map-canvas"></div>
	<div id="gs-nearby-results" class="gs-full-width" style="display: none;"></div>
</div>
