/**
 * BLOCK: algori-image-video-slider
 *
 * Algori Image and Video Slider is a Gutenberg Block Plugin that enables you easily add image and video sliders to your website.
 */


 /**
 * External dependencies
 */
import { filter, pick } from 'lodash';
import Slider from 'react-slick';
import classnames from 'classnames';
 
 
/**
 * WordPress dependencies
 */
const { 
	PanelBody,
	TextControl,  
	Toolbar,
	ToolbarButton,
	Tooltip,
	ToggleControl, 
	RadioControl,
	Button,
	Popover,
	RangeControl,
	Spinner,
	withNotices } = wp.components; // import { PanelBody, RangeControl, ToggleControl, Toolbar, ToolbarButton, withNotices } from '@wordpress/components';
const { Fragment, createRef } = wp.element; // import { Fragment } from '@wordpress/element'; 
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { 
	BlockControls,
	InspectorControls,
	BlockAlignmentToolbar,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	AlignmentToolbar,
	RichText,
	URLInput,
} = wp.blockEditor; // Import * from @wordpress/blockEditor 
const { isBlobURL } = wp.blob;


/**
 * Internal dependencies
 *
 * Import CSS.
 */
import './style.scss';
import './editor.scss';


/**
 * Module Constants
 */
const ALLOWED_MEDIA_TYPES = [ 'video', 'image' ];


const blockAttributes = {
	title: {
		type: 'array',
		source: 'children',
		selector: 'p',
	},
	url: {
		type: 'string',
	},
	contentAlign: {
		type: 'string',
		default: 'center',
	},
	id: {
		type: 'number',
	},
	sliderImagesVideos: {
		type: 'array',
		default: [],
	},
	settings: {
		type: 'object',
		default: { 
			dots: true,
			arrows: true,
			autoplay: false,
			pauseOnFocus: false,
			rtl: false,
			vertical: false,
			fade: false,
			lazyLoad: false,
			centerMode: false,
			infinite: true,
			adaptiveHeight: true,
			speed: 500,
			autoplaySpeed: 3000,
			slidesToShow: 1,
			slidesToScroll: 1,
			rows: 1,
			slidesPerRow: 1
		},
    },
	selectedDotsClass: {
		type: 'string',
		default: 'dots-style-1-off-slide',
	},
	selectedArrowsClass: {
		type: 'string',
		default: 'arrows-style-1-off-slide',
	},
	dotsOnTopOfSlide: {
		type: 'boolean',
		default: false,
	},
	arrowsOnTopOfSlide: {
		type: 'boolean',
		default: false,
	},
	textBlockVisible: {
		type: 'boolean',
		default: false,
	},
	ctaButtonVisible: {
		type: 'boolean',
		default: true,
	},
	dimRatio: {
		type: 'number',
		default: 0,
	},
	content: {
		type: 'array',
		source: 'children',
		selector: 'h2',
	},
	textBlockContent: {
		type: 'object',
		default: {}
	},
	currentSlide: {
		type: 'number',
		default: 0,
	},
	videoSettings: {
		type: 'object',
		default: {
			preload: true,
			controls: true,
			autoplay: true,
			muted: true,
			loop: true,
		}
	},
};

/**
 * Cater for block categories in older versions of WordPress i.e < WP 5.5
 */
const hasFormattingCategory = wp.blocks.getCategories().some( function( category ) {
	return category.slug === 'common';
} );

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'algori-image-video-slider/block-algori-image-video-slider', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	
	title: __( 'Image & Video Slider' ), // Block title.
	
	description: __( 'Capture your site visitors\' attention with compelling image and video slideshows.  Add an image/video slider.' ),  // Block description that appears in the block inspector. Make it short preferably.
	
	icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M1 5h2v14H1zm4 0h2v14H5zm17 0H10c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zM11 17l2.5-3.15L15.29 16l2.5-3.22L21 17H11z"/></svg>, // Block icon from Material Design Icons → https://material.io/tools/icons/
	
	category: hasFormattingCategory ? 'common' : 'media', // Block category — Group blocks together based on common traits E.g. text, media, design, widgets, embeds, reusable.
	
	keywords: [ // Block search keywords
		__( 'algori carousel slideshows' ), 
		__( 'photo gallery' ), 
		__( 'photos images videos' ), 
	],
	
	example: {
		attributes: {
			sliderImagesVideos: [
				  {
					"url": cgbGlobal_AlgoriImageVideoSlider.pluginDirUrl + "algori-image-video-slider-example-1.jpg",
					"type": "image",
					"mime": "image/jpeg"
				  },
				  {
					"url": cgbGlobal_AlgoriImageVideoSlider.pluginDirUrl + "algori-image-video-slider-example-2.jpg",
					"type": "image",
					"mime": "image/jpeg"
				  },
				  {
					"url": cgbGlobal_AlgoriImageVideoSlider.pluginDirUrl + "algori-image-video-slider-example-3.jpg",
					"type": "image",
					"mime": "image/jpeg"
				  }
			],
			settings: {
				dots: true,
				arrows: true,
				autoplay: true
			},
		},
	},
	
	attributes: blockAttributes,  // Block attributes for editing in the block inspector.

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: withNotices( ( { attributes, setAttributes, isSelected, className, noticeOperations, noticeUI } ) => {
		
		const { url, title, align, contentAlign, id, sliderImagesVideos, sliderDots, settings, selectedDotsClass, selectedArrowsClass, dotsOnTopOfSlide, arrowsOnTopOfSlide, textBlockVisible, ctaButtonVisible, dimRatio, content, textBlockContent, currentSlide, videoSettings } = attributes;
	
		const updateSliderDots = ( sliderDots ) => setAttributes( { settings: { ...settings, dots: sliderDots } } );
		const updateSliderArrows = ( sliderArrows ) => setAttributes( { settings: { ...settings, arrows: sliderArrows } } );
		const updateSliderAutoplay = ( sliderAutoplay ) => setAttributes( { settings: { ...settings, autoplay: sliderAutoplay } } );
		
		
		const updateCurrentSlide = ( currentSlide ) => {
			setAttributes( { currentSlide: currentSlide } );
		}
		
		const initialTextBlockContent = ( numOfImages ) => {
			for( let i=0; i < numOfImages; i++ ){
				textBlockContent[`text-block-sub-heading-${i}`] = __('Sub Heading Goes Here...');
				textBlockContent[`text-block-paragraph-${i}`] = __('Pargraph Text goes here...');
				textBlockContent[`text-block-cta-text-${i}`] = __('Add Call To Action');
				textBlockContent[`text-block-cta-link-${i}`] = 'http://www.example.com';
			}
			return textBlockContent;
		}
		
		const onSelectImagesVideos = ( imagesVideos ) => {
			setAttributes( {
				sliderImagesVideos: imagesVideos.map( ( imageVideo ) => pick( imageVideo, [ 'alt', 'caption', 'id', 'link', 'url', 'type', 'media_type', 'mime', 'mime_type' ] ) ),
				textBlockContent: initialTextBlockContent( imagesVideos.length ),
			} );
		}
		
		const classesForSlider = classnames(
			selectedDotsClass, 
			selectedArrowsClass, 
		);
		
		const classesForTextBlockInSlider = classnames(
			"algori-image-video-slider-slide-text-block", 
			dimRatioToClass( dimRatio )
		);
		
		
		const controls = ( // Set Block and Inspector Controls
			<Fragment>
				<BlockControls>
					<Toolbar>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectImagesVideos }
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								multiple
								gallery
								value={ sliderImagesVideos.map( ( imgOrVid ) => imgOrVid.id ) }
								render={ ( { open } ) => (
									<ToolbarButton
										label={ __( 'Edit Image Slider' ) }
										icon="edit"
										onClick={ open }
									/>
								) }
							/>
						</MediaUploadCheck>
					</Toolbar>
				</BlockControls>
				{ !! sliderImagesVideos.length && (
					<InspectorControls>
						<PanelBody title={ __( 'Slider General Settings' ) }>
							
								<ToggleControl // Hide / Show Image Slider Navigation Dots
									label={ ( !! settings.dots ) ? __( 'Hide Navigation Dots' ) : __( 'Show Navigation Dots' ) }
									checked={ !! settings.dots }
									onChange={ updateSliderDots }
								/>
								<ToggleControl // Hide / Show Image Slider Navigation Arrows
									label={ ( !! settings.arrows ) ? __( 'Hide Navigation Arrows' ) : __( 'Show Navigation Arrows' ) }
									checked={ !! settings.arrows }
									onChange={ updateSliderArrows }
								/>
								<ToggleControl // Disable / Enable Slideshow Autoplay
									label={ ( !! settings.autoplay ) ? __( 'Disable Slideshow Autoplay' ) : __( 'Enable Slideshow Autoplay' ) }
									checked={ !! settings.autoplay }
									onChange={ updateSliderAutoplay }
								/>
								
						</PanelBody>
					</InspectorControls>
				) }
			</Fragment>
		);
		
		if ( sliderImagesVideos.length === 0 ) { // Upload image if it doesn't exist
			
			return ( 
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon={ <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M1 5h2v14H1zm4 0h2v14H5zm17 0H10c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zM11 17l2.5-3.15L15.29 16l2.5-3.22L21 17H11z"/></svg> }
						className={ className }
						labels={ {
							title: __('\u00A0Image Slider' ),
							instructions: __( 'Drag images or videos, upload new ones or select files from your library.' ),
						} }
						onSelect={ onSelectImagesVideos }
						accept="video/*, image/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						multiple
						notices={ noticeUI }
						onError={ noticeOperations.createErrorNotice }
					/>
				</Fragment>
			);
			
		}
		
		
		return ( // Return image & video slider with element settings (css classes) and block controls. Get image using either { url } or { id }
			<Fragment>
				{ controls }
				<div>
					<Slider className={ classesForSlider } { ...settings } afterChange={ updateCurrentSlide } >
						{ sliderImagesVideos.map( ( imgOrVid, index ) => (
							<div key={ imgOrVid.id || imgOrVid.url } >
								{ isBlobURL( imgOrVid.url ) && <Spinner /> }
								<figure className="algori-image-video-slider-slide-container">
									{ ( imgOrVid.type === 'image' || imgOrVid.media_type === 'image' ) && // for image slides where media library type: "image" or formfileupload media_type: "image"
										<img 
											src={ imgOrVid.url } 
											alt={ imgOrVid.alt }
										/>
									}
									{ ( imgOrVid.type === 'video' || imgOrVid.media_type === 'file' ) && // for video slides where type: "video" or formfileupload media_type: "file". PS: it's "file" because we are trusting allowedTypes.
										<video 
											autoPlay={ ( !!videoSettings['autoplay'] ) ? "autoplay" : videoSettings['autoplay'] }
											preload={ ( !!videoSettings['preload'] ) ? "preload" : videoSettings['preload'] }
											controls={ ( !!videoSettings['controls'] ) ? "controls" : videoSettings['controls'] }
											muted={ ( !!videoSettings['muted'] ) ? "muted" : videoSettings['muted'] }
											loop={ ( !!videoSettings['loop'] ) ? "loop" : videoSettings['loop'] }
											width="100%" 
											height="100%"
										>
											
											<source src={ imgOrVid.url } type={ ( ( imgOrVid.mime || imgOrVid.mime_type ) !== "video/videopress" ) ? ( imgOrVid.mime || imgOrVid.mime_type ) : "video/mp4" } /> 
									
											{ __('Sorry, your browser doesn\'t support embedded videos, ') }
											{ __('but don\'t worry, you can ') }
											<a href={ imgOrVid.url } target="_blank" rel="noopener noreferrer" tabindex="0">
												{ __('download it here') }
											</a> 
											{ __(' and watch it with your favorite video player!') }
											
										</video>
									}
									{ !!textBlockVisible &&
										<figcaption className={ classesForTextBlockInSlider } id={ `text-block-${ index }` } >
											<span className= "algori-image-video-slider-slide-text-block-sub-heading-editor" >
												<RichText
													tagName="h2"
													className= "algori-image-video-slider-slide-text-block-sub-heading"
													placeholder={ __( 'Sub Heading Goes Here…' ) }
													value={ textBlockContent[`text-block-sub-heading-${index}`] }
													onChange={ ( subHeadingContent ) => setAttributes( { textBlockContent: { ...textBlockContent, [`text-block-sub-heading-${index}`] : subHeadingContent } } ) } 
													inlineToolbar
												/>
											</span>
											<span className= "algori-image-video-slider-slide-text-block-paragraph-editor" >
												<RichText
													tagName="p"
													className= "algori-image-video-slider-slide-text-block-paragraph"
													placeholder={ __( 'Pargraph Text goes here…' ) }
													value={ textBlockContent[`text-block-paragraph-${index}`] }
													onChange={ ( paragraphContent ) => setAttributes( { textBlockContent: { ...textBlockContent, [`text-block-paragraph-${index}`] : paragraphContent } } ) } 
													inlineToolbar
												/>
											</span>
											{ ctaButtonVisible &&
												<span className= "algori-image-video-slider-slide-text-block-cta-editor" >
													{ ( currentSlide === index ) && // Confirm current slide then show CTA editor popover
														<Popover 
															position ="bottom center"
															onKeyDown={ (event)=>{ event.stopPropagation() } } 
															onKeyPress={ (event)=>{ event.stopPropagation() } }
														>
															<TextControl
																type="text" 
																id={ `text-block-cta-text-${ index }` }
																label={ __( 'Button Text:' ) }
																value={ textBlockContent[`text-block-cta-text-${index}`] }
																onChange={ ( valueOfCTAText ) => setAttributes( { textBlockContent: { ...textBlockContent, [`text-block-cta-text-${index}`] : valueOfCTAText } } ) }
															/>
															<TextControl
																type="url" 
																id={ `text-block-cta-link-${ index }` }
																label={ __( 'Button Link:' ) }
																value={ textBlockContent[`text-block-cta-link-${index}`] }
																onChange={ ( valueOfCTALink ) => setAttributes( { textBlockContent: { ...textBlockContent, [`text-block-cta-link-${index}`] : valueOfCTALink } } ) }
															/>
														</Popover>
													}
													<Button 
														isDefault
														href = { textBlockContent[`text-block-cta-link-${index}`] }
														className="algori-image-video-slider-slide-text-block-cta"
													>
														{ textBlockContent[`text-block-cta-text-${index}`] }
													</Button>
												</span>
											}
										</figcaption>
									}
								</figure>
							</div>
						) ) }
					</Slider>
					<br/>
				</div>
			</Fragment>
		);
		
	} ),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: ( { attributes, className } ) => {
		
		const { url, title, align, contentAlign, id, sliderImagesVideos, settings, selectedDotsClass, selectedArrowsClass, textBlockVisible, ctaButtonVisible, dimRatio, content, textBlockContent, videoSettings } = attributes;
		
		const classesForSlider = classnames(
			selectedDotsClass, 
			selectedArrowsClass, 
		);
		
		const classesForTextBlockInSlider = classnames(
			"algori-image-video-slider-slide-text-block", 
			dimRatioToClass( dimRatio )
		);
		
		return (
			<div className={ classesForSlider } data-slick={ JSON.stringify( settings ) }>
				{ sliderImagesVideos.map( ( imgOrVid, index ) => (
					<div key={ imgOrVid.id || imgOrVid.url } >
						<figure className="algori-image-video-slider-slide-container">
						    { ( imgOrVid.type === 'image' || imgOrVid.media_type === 'image' ) && // for image slides where media library type: "image" or formfileupload media_type: "image"
								<img 
									src={ imgOrVid.url } 
									alt={ imgOrVid.alt }
								/>
							}
							{ ( imgOrVid.type === 'video' || imgOrVid.media_type === 'file' ) && // for video slides where type: "video" or formfileupload media_type: "file". PS: it's "file" because we are trusting allowedTypes.
								<video 
									autoPlay={ ( !!videoSettings['autoplay'] ) ? "autoplay" : videoSettings['autoplay'] }
									preload={ ( !!videoSettings['preload'] ) ? "preload" : videoSettings['preload'] }
									controls={ ( !!videoSettings['controls'] ) ? "controls" : videoSettings['controls'] }
									muted={ ( !!videoSettings['muted'] ) ? "muted" : videoSettings['muted'] }
									loop={ ( !!videoSettings['loop'] ) ? "loop" : videoSettings['loop'] }
									width="100%" 
									height="100%"
								>
									
									<source src={ imgOrVid.url } type={ ( ( imgOrVid.mime || imgOrVid.mime_type ) !== "video/videopress" ) ? ( imgOrVid.mime || imgOrVid.mime_type ) : "video/mp4" } /> 
									
									{ __('Sorry, your browser doesn\'t support embedded videos, ') }
									{ __('but don\'t worry, you can ') }
									<a href={ imgOrVid.url } target="_blank" rel="noopener noreferrer" tabindex="0">
										{ __('download it here') }
									</a> 
									{ __(' and watch it with your favorite video player!') }
											
								</video>
							}
							{ !!textBlockVisible &&
								<figcaption className={ classesForTextBlockInSlider } id={ `text-block-${ index }` } >
									<span className= "algori-image-video-slider-slide-text-block-sub-heading-editor" >
										<RichText.Content
											tagName="h2"
											className={ "algori-image-video-slider-slide-text-block-sub-heading" }
											value={ textBlockContent[`text-block-sub-heading-${index}`] }
										/>
									</span>
									<span className= "algori-image-video-slider-slide-text-block-paragraph-editor" >
										<RichText.Content
											tagName="p"
											className={ "algori-image-video-slider-slide-text-block-paragraph" }
											value={ textBlockContent[`text-block-paragraph-${index}`] }
										/>
									</span>
									{ ctaButtonVisible &&
										<span className= "algori-image-video-slider-slide-text-block-cta-editor" >
											<a 
												href = { textBlockContent[`text-block-cta-link-${index}`] } 
												class="components-button is-button is-default algori-image-video-slider-slide-text-block-cta"
											>
												{ textBlockContent[`text-block-cta-text-${index}`] }
											</a>
										</span>
									}
								</figcaption>
							}
						</figure>
					</div>
				) ) }
			</div>
		);
		
	},
	
	/**
	 * Array of deprecated forms of this block.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/deprecated-blocks/
	 */
	deprecated: [ 
		{
			save: ( { attributes, className } ) => {
		
				const { url, title, align, contentAlign, id, sliderImagesVideos, settings, selectedDotsClass, selectedArrowsClass, textBlockVisible, ctaButtonVisible, dimRatio, content, textBlockContent, videoSettings } = attributes;
				
				const classesForSlider = classnames(
					selectedDotsClass, 
					selectedArrowsClass, 
				);
				
				const classesForTextBlockInSlider = classnames(
					"algori-image-video-slider-slide-text-block", 
					dimRatioToClass( dimRatio )
				);
				
				return (
					<div className={ classesForSlider } data-slick={ JSON.stringify( settings ) }>
						{ sliderImagesVideos.map( ( imgOrVid, index ) => (
							<div key={ imgOrVid.id || imgOrVid.url } >
								<figure className="algori-image-video-slider-slide-container">
									{ ( imgOrVid.type === 'image' || imgOrVid.media_type === 'image' ) && // for image slides where media library type: "image" or formfileupload media_type: "image"
										<img 
											src={ imgOrVid.url } 
											alt={ imgOrVid.alt }
										/>
									}
									{ ( imgOrVid.type === 'video' || imgOrVid.media_type === 'file' ) && // for video slides where type: "video" or formfileupload media_type: "file". PS: it's "file" because we are trusting allowedTypes.
										<video 
											autoPlay={ ( !!videoSettings['autoplay'] ) ? "autoplay" : videoSettings['autoplay'] }
											preload={ ( !!videoSettings['preload'] ) ? "preload" : videoSettings['preload'] }
											controls={ ( !!videoSettings['controls'] ) ? "controls" : videoSettings['controls'] }
											muted={ ( !!videoSettings['muted'] ) ? "muted" : videoSettings['muted'] }
											loop={ ( !!videoSettings['loop'] ) ? "loop" : videoSettings['loop'] }
											width="100%" 
											height="100%"
										>
											<source src={ imgOrVid.url } type="video/mp4" /> 
										</video>
									}
									{ !!textBlockVisible &&
										<figcaption className={ classesForTextBlockInSlider } id={ `text-block-${ index }` } >
											<span className= "algori-image-video-slider-slide-text-block-sub-heading-editor" >
												<RichText.Content
													tagName="h2"
													className={ "algori-image-video-slider-slide-text-block-sub-heading" }
													value={ textBlockContent[`text-block-sub-heading-${index}`] }
												/>
											</span>
											<span className= "algori-image-video-slider-slide-text-block-paragraph-editor" >
												<RichText.Content
													tagName="p"
													className={ "algori-image-video-slider-slide-text-block-paragraph" }
													value={ textBlockContent[`text-block-paragraph-${index}`] }
												/>
											</span>
											{ ctaButtonVisible &&
												<span className= "algori-image-video-slider-slide-text-block-cta-editor" >
													<a 
														href = { textBlockContent[`text-block-cta-link-${index}`] } 
														class="components-button is-button is-default algori-image-video-slider-slide-text-block-cta"
													>
														{ textBlockContent[`text-block-cta-text-${index}`] }
													</a>
												</span>
											}
										</figcaption>
									}
								</figure>
							</div>
						) ) }
					</div>
				);
				
			},
		},
		{
			attributes: {
				...blockAttributes,
			},
			
			save: ( { attributes, className } ) => {
		
				const { url, title, align, contentAlign, id, sliderImagesVideos, settings, selectedDotsClass, selectedArrowsClass, textBlockVisible, ctaButtonVisible, dimRatio, content, textBlockContent, videoSettings } = attributes;
				
				const classesForSlider = classnames(
					selectedDotsClass, 
					selectedArrowsClass, 
				);
				
				const classesForTextBlockInSlider = classnames(
					"algori-image-video-slider-slide-text-block", 
					dimRatioToClass( dimRatio )
				);
				
				return (
					<div className={ classesForSlider } data-slick={ JSON.stringify( settings ) }>
						{ sliderImagesVideos.map( ( imgOrVid, index ) => (
							<div key={ imgOrVid.id || imgOrVid.url } >
								<figure className="algori-image-video-slider-slide-container">
									{ ( imgOrVid.type === 'image' ) && // for image slides where type: "image"
										<img 
											src={ imgOrVid.url } 
											alt={ imgOrVid.alt }
										/>
									}
									{ ( imgOrVid.type === 'video' ) && // for video slides where type: "video"
										<video 
											autoPlay={ ( !!videoSettings['autoplay'] ) ? "autoplay" : videoSettings['autoplay'] }
											preload={ ( !!videoSettings['preload'] ) ? "preload" : videoSettings['preload'] }
											controls={ ( !!videoSettings['controls'] ) ? "controls" : videoSettings['controls'] }
											muted={ ( !!videoSettings['muted'] ) ? "muted" : videoSettings['muted'] }
											loop={ ( !!videoSettings['loop'] ) ? "loop" : videoSettings['loop'] }
											width="100%" 
											height="100%"
										>
											<source src={ imgOrVid.url } type="video/mp4" /> 
										</video>
									}
									{ !!textBlockVisible &&
										<figcaption className={ classesForTextBlockInSlider } id={ `text-block-${ index }` } >
											<span className= "algori-image-video-slider-slide-text-block-sub-heading-editor" >
												<RichText.Content
													tagName="h2"
													className={ "algori-image-video-slider-slide-text-block-sub-heading" }
													value={ textBlockContent[`text-block-sub-heading-${index}`] }
												/>
											</span>
											<span className= "algori-image-video-slider-slide-text-block-paragraph-editor" >
												<RichText.Content
													tagName="p"
													className={ "algori-image-video-slider-slide-text-block-paragraph" }
													value={ textBlockContent[`text-block-paragraph-${index}`] }
												/>
											</span>
											{ ctaButtonVisible &&
												<span className= "algori-image-video-slider-slide-text-block-cta-editor" >
													<a 
														href = { textBlockContent[`text-block-cta-link-${index}`] } 
														class="components-button is-button is-default algori-image-video-slider-slide-text-block-cta"
													>
														{ textBlockContent[`text-block-cta-text-${index}`] }
													</a>
												</span>
											}
										</figcaption>
									}
								</figure>
							</div>
						) ) }
					</div>
				);
				
			},
		}
	],
	
} );


function dimRatioToClass( ratio ) {
	return ( ratio === 0 ) ?
		null :
		'algori-image-video-slider-slide-text-block-background-dim-' + ( 10 * Math.round( ratio / 10 ) );
}