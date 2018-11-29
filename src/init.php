<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package Algori_Image_Video_Slider
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function algori_image_video_slider_cgb_block_assets() {
	// Scripts.
	wp_enqueue_script('jquery');
	wp_enqueue_script( 'algori_image_video_slider-cgb-slick-js', plugins_url( '/dist/slick/slick.js', dirname( __FILE__ ) ) );
	wp_add_inline_script( 'algori_image_video_slider-cgb-slick-js', 'jQuery( document ).ready(function($) { $(".wp-block-cgb-block-algori-image-video-slider").slick({ }); });' );
	// wp_add_inline_script( 'algori_image_video_slider-cgb-slick-js', 'alert("Here")' );
	
	// Styles.
	wp_enqueue_style(
		'algori_image_video_slider-cgb-slick-css', // Handle.
		plugins_url( 'dist/slick/slick.css', dirname( __FILE__ ) ) // Block style CSS.
		// array( 'wp-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: filemtime — Gets file modification time.
	);
	
	wp_enqueue_style(
		'algori_image_video_slider-cgb-slick-theme-css', // Handle.
		plugins_url( 'dist/slick/slick-theme.css', dirname( __FILE__ ) ) // slick-theme style CSS.
		// array( 'wp-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: filemtime — Gets file modification time.
	);
	
	wp_enqueue_style(
		'algori_image_video_slider-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function algori_image_video_slider_cgb_block_assets().

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'algori_image_video_slider_cgb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function algori_image_video_slider_cgb_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'algori_image_video_slider-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'algori_image_video_slider-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function algori_image_video_slider_cgb_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'algori_image_video_slider_cgb_editor_assets' );
