<?php
/**
 * Plugin Name: Algori Image & Video Slider Lite
 * Plugin URI: https://github.com/kevinbazira/algori-image-and-video-slider-lite/
 * Description: <strong>Algori Image and Video Slider</strong> is a Gutenberg Block Plugin that enables you easily add image and video sliders to your website. Capture your site visitors' attention with compelling video and image slideshows. <strong>This will boost user engagement and increase revenue for your site</strong>.
 * Author: Kevin Bazira
 * Author URI: http://kevinbazira.com/
 * Version: 1.0.6
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Algori_Image_Video_Slider
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
