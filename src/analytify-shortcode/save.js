/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * save function just add the raw shortcode contents in the html
 * after that we render the shortcode contents through our pro plugin.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( {attributes} ) {
	return <p><RawHTML>{ attributes.shortcode }</RawHTML></p>;
}
