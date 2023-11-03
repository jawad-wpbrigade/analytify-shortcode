import {AnalytifyBlockVariationPicker} from './blockVariationPicker';

import EditSimpleShortCode from './editSimpleShortCode';

import EditAdvanceShortCode from './editAdvancedShortcode';

import './assets/editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 * @param {boolean}  props.isSelected    Boolean whether the block is selected in editor.
 *
 * @return {Element} Element to render.
 */
export default function Edit( props ) {
    

    const { attributes: {shortCodeType} } = props;

    let Component = AnalytifyBlockVariationPicker;

    if( shortCodeType === 'simple' ) {

        Component = EditSimpleShortCode

    } else if( shortCodeType === 'advanced' ) {

        Component = EditAdvanceShortCode

    }
    
	return <Component { ...props } />;

}