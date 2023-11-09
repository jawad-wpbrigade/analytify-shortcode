/**
 * WordPress components that create the necessary UI elements for the block
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */

import {
	SelectControl,
	PanelBody,
    DatePicker,
    PanelRow,
    __experimentalInputControl as InputControl
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

// The metrics to show in inspector control dropdown
import metrics from './data/metrics.json';

// The dimensions to show in inspector control dropdown
import dimensions from './data/dimensions.json';

import sortOptions from './data/sortOptions.json';

// Use the instance id to refer to the current active instance of block in editor.
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

import{ useEffect, useRef, useState } from '@wordpress/element';

import './assets/editor.scss';

/**
 * EditAdvanceShortCode component essentially make almost all the available attributes 
 * for Analytify shortcode in the inspector sidebar of the block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function EditAdvanceShortCode( { attributes, setAttributes } ) {


    const{ shortcode, 
           selectedMetrics, 
           selectedDimensions, 
           sortOption, 
           selectedDate, 
           analyticsFor, 
           post_id } = attributes;

    const [ startDate, setStartDate ] = useState( '' );

    const [ endDate, setEndDate ]     = useState( '' );
    
    /**
     * This is to avoid the shortcode building on first render
     * instead we will show the predefined shortcode both on 
     * the first render and in the preview.
     */
    const isInitialMount = useRef(true);

    const instanceId = useInstanceId( EditAdvanceShortCode );

    useEffect( () => {

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Start creating the shortcode.
        let createdShortcode = `[analytify-stats`;

        // If user has selected some metrics add it to the shortcode.
        if( selectedMetrics?.length ) {
            createdShortcode = createdShortcode + ` metrics="${selectedMetrics}"`;
        }

        // If user has selected some dimensions and that to shortcode.
        if( selectedDimensions?.length ) {
            createdShortcode = createdShortcode + ` dimensions="${selectedDimensions}"`;
        }

        /**
         * There are two types of dates predefined and custom 
         * both have slightly different structure.
         * we will check that and store the structure in this
         * variable.
         */
        let date = '';

        if( selectedDate ) {
             date = ` date_type="${selectedDate}"`;
        }
        
        if ( startDate || endDate ) {
             date = ` date_type='custom' start_date="${startDate}" end_date="${endDate}"`;
        }

        // Add the date variable contents to shortcode.
        createdShortcode = createdShortcode + date;

        createdShortcode = createdShortcode + ` analytics_for="${analyticsFor}"`;

        // If the Analytics for is page id and some post id is selected add that to shortcode.
        if( analyticsFor === 'page_id' && post_id ) {
            createdShortcode = createdShortcode + ` custom_page_id="${post_id}"`
        }

        // If user has selected some sort option add that to shortcode
        if ( sortOption ) {
            createdShortcode = createdShortcode + ` sort="${sortOption}"`;
        }

        // At last close the shortcode with closing bracket.
        createdShortcode = createdShortcode + ']';

        // Save the created shortcode in attributes and re-render the component.
        setAttributes( { shortcode: createdShortcode } );

    }, [selectedMetrics,selectedDimensions ,selectedDate, sortOption, analyticsFor, startDate, endDate, post_id] );

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
                        onChange={ ( metrics ) => { 

                            if( '' == metrics[0] ) {
                                setAttributes( { selectedMetrics: [] } ) 
                            } else {
                                setAttributes( { selectedMetrics: [...metrics] } ) 
                            }
                            
                        } }
                        __nextHasNoMarginBottom
                    />

                    <SelectControl
                        multiple
                        label="Select Dimensions"
                        value={ selectedDimensions }
                        options={ dimensions }
                        onChange={ ( dimensions ) => { 

                            if( '' == dimensions[0] ) {
                                setAttributes( { selectedDimensions: [] } ) 
                            } else {
                                setAttributes( { selectedDimensions: [...dimensions] } ) 
                            }
                            
                        } }
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
                        onChange={ ( date ) => { setAttributes( { selectedDate: date } ); setStartDate(''); setEndDate('') } }
                        __nextHasNoMarginBottom
                    />

                    <SelectControl
                        label="Sort by"
                        value={ sortOption }
                        options={ sortOptions }
                        onChange={ ( sortOption ) => setAttributes( { sortOption: sortOption } ) }
                        __nextHasNoMarginBottom
                    />


                    <SelectControl
                        label="Analytics For:"
                        value={ analyticsFor }
                        options={ [
                            { "value": "current", "label": "Current Post/Page" },
                            { "value": "full", "label": "Full Site" },
                            { "value": "page_id", "label" : "Post/Page ID" }
                        ] }
                        onChange={ ( analyticsFor ) => setAttributes( { analyticsFor: analyticsFor } ) }
                        __nextHasNoMarginBottom
                    />

                    { analyticsFor === 'page_id' && <InputControl
								label="Enter Post ID"
								type="number"
								value={post_id}
								onChange={ (post_id) => { post_id > 0 ? setAttributes({ post_id : post_id }) : setAttributes({ post_id : null }) } }
							/> 
                    }

                </PanelBody>

                <PanelBody title="Custom Date" initialOpen={ false }>
                    <PanelRow><label>{__('Start Date:', 'wp-analytify-pro')}</label></PanelRow>
                    <DatePicker
                        currentDate={ startDate } 
                        onChange={ ( newDate ) => setStartDate( new Date( newDate ).toLocaleDateString("en-CA") ) }
                        is12Hour={ true }
                    />
                    <PanelRow><label>{__('End Date:', 'wp-analytify-pro')}</label></PanelRow>
                    <DatePicker
                        currentDate={ endDate } 
                        onChange={ ( newDate ) => setEndDate( new Date( newDate ).toLocaleDateString("en-CA") ) }
                        is12Hour={ true }
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