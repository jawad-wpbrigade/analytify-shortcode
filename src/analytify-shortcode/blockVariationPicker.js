import { useSelect } from '@wordpress/data';
import {
	__experimentalBlockVariationPicker as BlockVariationPicker,
	useBlockProps
} from '@wordpress/block-editor';

// Block store contains information about the block.
import { store as blocksStore } from '@wordpress/blocks';


/**
 * Analytify BlockVariationPicker helps to present user with initial option to 
 * choose the simple version of block or the advanced version of the block.
 */
export const AnalytifyBlockVariationPicker = ( {name: blockName, setAttributes} ) => {

    const { blockType, defaultVariation, variations } = useSelect(
		( select ) => {
			const {
				getBlockVariations,
				getBlockType,
				getDefaultBlockVariation,
			} = select( blocksStore );

			return {
				blockType: getBlockType( blockName ),
				defaultVariation: getDefaultBlockVariation( blockName, 'block' ),
				variations: getBlockVariations( blockName, 'block' ),
			};
		},
		[ blockName ]
	);

	return (
		<div {...useBlockProps()} >
			<BlockVariationPicker
				icon={ blockType?.icon?.src }
				label={ blockType?.title }
				variations={ variations }
				onSelect={ ( nextVariation = defaultVariation ) => {
					if ( nextVariation.attributes ) {
						setAttributes( nextVariation.attributes  );
					}
				} }
			/>
		</div>
    );
};