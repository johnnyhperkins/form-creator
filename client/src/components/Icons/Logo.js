import React from 'react'

export default () => {
	let style = { height: 'auto', width: '1.5em', display: 'block' }
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 194.85 337.5"
			style={style}>
			<g>
				<polygon
					style={{ fill: '#ff5c8d' }}
					points="129.9 150 64.95 187.5 129.9 225 129.9 300 64.95 337.5 0 300 0 75 64.95 37.5 129.9 75 129.9 150"
				/>
			</g>
			<g>
				<polygon
					style={{ fill: '#a00037' }}
					points="194.85 112.5 129.9 150 194.85 187.5 194.85 262.5 129.9 300 64.95 262.5 64.95 37.5 129.9 0 194.85 37.5 194.85 112.5"
				/>
			</g>
			<g>
				<polygon
					style={{ fill: '#d81b60' }}
					points="129.9 150 64.95 187.5 64.95 37.5 129.9 75 129.9 150"
				/>
				<polygon
					style={{ fill: '#d81b60' }}
					points="64.95 262.5 64.95 187.5 129.9 225 129.9 300 64.95 262.5"
				/>
			</g>
		</svg>
	)
}
