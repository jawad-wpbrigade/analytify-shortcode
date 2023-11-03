import { useSelect } from '@wordpress/data';
import {
	__experimentalBlockVariationPicker as BlockVariationPicker,
	useBlockProps
} from '@wordpress/block-editor';

import { store as blocksStore } from '@wordpress/blocks';

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