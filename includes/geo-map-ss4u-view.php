<div id="gs-content" class="gs-full-width">
    <div id="gs-fields-block" class="gs-full-width">
        <div id="searchPlacesFrm">
            <!--<div id="alert_msg" class="alert-danger alert"></div>-->
            <input class='gs-full-width' id="autocomplete" placeholder="Enter your search term" type="text" />
            <div id="gs-fields-block" class="gs-full-width">
                <p>Search for the selected types within a radius of</p>
            </div>
            <div class="gs-full-width" id="gs-radius-block">
                <select id="radius-level">
                    <?php
                    /**
                     * Radius Dropdown
                     * @package geo-map-ss4u
                     */
                    $minimumRadius = 1;
                    for ($currentRadius = $minimumRadius; $currentRadius <= get_option('gms_search_radius'); $currentRadius++) {
                        ?>
                        <option value="<?php echo esc_html_e($currentRadius); ?>"><?php echo esc_html_e($currentRadius); ?></option>
                    <?php }
                    ?>
                </select>
                <p>Km</p>
            </div>
            <div id="gs-place-types">
                <p id="paraText">Select any one option</p>
				<ul>
                <?php
                $place_types = array('train_station' => 'Train station', 'bank' => 'Bank', 'hospital' => 'Hospital', 'bus_station' => 'Bus station');
                foreach ($place_types as $place_type => $place_label) {
                    ?>
					<li class="options">
						<input type="radio"
							   class="place_type"
							   name="place_type"
							   data-place-label ="<?php echo esc_html_e($place_label); ?>"
							   value="<?php echo esc_html_e($place_type); ?>"
						<?php
						if ($place_type == 'train_station') {
							echo'checked';
						}
						?>
							   />
						<p class="gs-place-type <?php echo $place_type; ?>"><?php echo esc_html_e($place_label); ?></p>
					</li>
                <?php }
                ?>
				</ul>
            </div>
            <button type="button" name="searchbutton" id="searchbutton" >Search</button>
            <div id="alert_msg"></div>
        </div>
    </div>
    <div id="map-canvas"></div>

    <div id="gs-nearby-results" class="gs-full-width" style="display: none;">
        <h3 id="title"></h3>
        <span id="gs-scroll-down" class="scroll" >Scroll to see more results</span>
        <div id="gs-nearby-results-cont"></div>
    </div>
</div>
