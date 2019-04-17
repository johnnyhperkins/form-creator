export default function reducer(state, { type, payload }) {
	switch (type) {
		case 'LOGIN_USER':
			return {
				...state,
				currentUser: payload,
			}
		case 'IS_LOGGED_IN':
			return {
				...state,
				isAuth: payload,
			}
		case 'SIGNOUT_USER':
			return {
				...state,
				currentUser: null,
				isAuth: false,
			}
		case 'DELETE_PIN':
			const deletedPin = payload
			const filteredPins = state.pins.filter(pin => pin._id !== deletedPin._id)
			return {
				...state,
				pins: filteredPins,
			}
		case 'CREATE_DRAFT':
			return {
				...state,
				draft: {
					longitude: 0,
					latitude: 0,
				},
				currentPin: null,
			}
		case 'UPDATE_DRAFT_LOCATION':
			return {
				...state,
				draft: {
					longitude: payload.longitude,
					latitude: payload.latitude,
				},
			}
		case 'SET_PIN':
			return {
				...state,
				currentPin: payload,
				draft: null,
			}
		case 'UPDATE_PIN':
			const updatedPin = payload
			const updatedPins = state.pins.map(
				pin => (pin._id === updatedPin._id ? updatedPin : pin),
			)
			return {
				...state,
				pins: updatedPins,
				currentPin: updatedPin,
			}
		case 'CREATE_PIN':
			const newPin = payload
			const prevPins = state.pins.filter(pin => pin._id !== newPin._id)
			return {
				...state,
				pins: [ ...prevPins, newPin ],
			}
		case 'DELETE_DRAFT':
			return { ...state, draft: null }
		case 'GET_PINS':
			return { ...state, pins: payload }
		default:
			return state
	}
}
