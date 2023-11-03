/**
 * WordPress components that create the necessary UI elements for the block
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */

import {
	SelectControl,
	PanelBody
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import metrics from './data/metrics.json';

import { useInstanceId } from '@wordpress/compose';


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
    PlainText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

import{ useEffect, useRef } from '@wordpress/element';

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
export default function EditSimpleShortCode( { attributes, setAttributes } ) {


    const{ shortcode, selectedMetrics, selectedDate, analyticsFor } = attributes;

    const isInitialMount = useRef(true);

    const instanceId = useInstanceId( EditSimpleShortCode );

    useEffect( () => {

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        setAttributes( { shortcode: `[analytify-stats metrics="${selectedMetrics}" date_type="${selectedDate}" analytics_for="${analyticsFor}"]` } );

    }, [selectedMetrics,selectedDate, analyticsFor] );

	const inputId = `analytify-shortcode-input-${ instanceId }`;

	return (

        <div { ...useBlockProps( { className: 'components-placeholder' } ) }>

            <InspectorControls>
                <PanelBody title={ __( 'Analytify Shortcode Orchestrator' ) }>
                    <SelectControl
                        multiple
                        label="Select Metrics"
                        value={ selectedMetrics }
                        options={ metrics }
                        onChange={ ( metrics ) => setAttributes( { selectedMetrics: [...metrics] } ) }
                        __nextHasNoMarginBottom
                    />

                    <SelectControl
                        label="Period:"
                        value={ selectedDate }
                        options={ [
                            { "value": "- 1 days", "label": "Yesterday"},
                            { "value": "- 7 days", "label": "Last week"},
                            { "value": "- 15 days", "label": "Last 15 days"},
                            { "value": "- 30 days", "label": "Last 30 days"},
                            { "value": "year-to-date", "label": "This year"},
                            { "value": "- 365 days", "label": "Last Year"}
                        ] }
                        onChange={ ( date ) => setAttributes( { selectedDate: date } ) }
                        __nextHasNoMarginBottom
                    />

                    <SelectControl
                        label="Analytics For:"
                        value={ analyticsFor }
                        options={ [
                            { "value": "current", "label": "Current Post/Page"},
                            { "value": "full", "label": "Full Site"}
                        ] }
                        onChange={ ( analyticsFor ) => setAttributes( { analyticsFor: analyticsFor } ) }
                        __nextHasNoMarginBottom
                    />

                </PanelBody>
            </InspectorControls>

			<label
				htmlFor={ inputId }
				className="components-placeholder__label"
			>
				{ __( 'Analytify Shortcode:' ) }
			</label>
			<PlainText
				className="blocks-shortcode__textarea"
				id={ inputId }
				value={ shortcode }
				onChange={ ( contents ) => setAttributes( { shortcode: contents } ) }
			/>

		</div>
	);
}