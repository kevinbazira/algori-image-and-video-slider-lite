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
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function algori_image_video_slider_cgb_block_assets() { // phpcs:ignore

	// Enqueue Algori Image Video Slider Scripts.
	wp_enqueue_script('jquery');
	wp_enqueue_script( 'algori_image_video_slider-cgb-slick-js', plugins_url( '/dist/slick/slick.js', dirname( __FILE__ ) ) );
	wp_add_inline_script( 'algori_image_video_slider-cgb-slick-js', 'jQuery( document ).ready(function($) { $(".wp-block-algori-image-video-slider-block-algori-image-video-slider").slick({ }); });' );
	
	
	// Enqueue Algori Image Video Slider Styles.
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
	
	// Register block styles for both frontend + backend.
	wp_register_style(
		'algori_image_video_slider-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'algori_image_video_slider-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'algori_image_video_slider-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
	wp_localize_script(
		'algori_image_video_slider-cgb-block-js',
		'cgbGlobal_AlgoriImageVideoSlider', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
			// Add more data here that you want to access from `cgbGlobal` object.
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'algori-image-video-slider/block-algori-image-video-slider', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'algori_image_video_slider-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'algori_image_video_slider-cgb-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'algori_image_video_slider-cgb-block-editor-css',
		)
	);
}

// Hook: Block assets.
add_action( 'init', 'algori_image_video_slider_cgb_block_assets' );
