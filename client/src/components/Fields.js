import React, { useContext, useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import FormField from '../components/FormField'
import styled from 'styled-components'

import handleError from '../utils/handleError'
import { snackbarMessage } from '../utils/snackbarMessage'
import Context from '../context'
import { useClient } from '../client'
import {
	UPDATE_FORM_MUTATION,
	DELETE_FIELD_MUTATION,
} from '../graphql/mutations'

const FieldContainer = styled.div`
	padding: 10px;
	margin-bottom: 10px;
`

const Fields = ({ formFields, setFormFields, formId }) => {
	const client = useClient()
	const { dispatch } = useContext(Context)

	const [ idToDelete, setIdToDelete ] = useState(null)

	useEffect(
		() => {
			if (idToDelete) {
				confirmDelete()
			}
		},
		[ idToDelete ],
	)

	const confirmDelete = () => {
		dispatch({
			type: 'TOGGLE_WARNING_MODAL',
			payload: {
				modalOpen: true,
				title: 'Are you sure you want to delete this field?',
				message:
					'All associated responses will be permanently deleted as well.',
				action: deleteField,
			},
		})
	}

	const deleteField = async () => {
		try {
			await client.request(DELETE_FIELD_MUTATION, {
				_id: idToDelete,
				formId,
			})

			setFormFields(formFields.filter(field => field._id !== idToDelete))
			setIdToDelete(null)
			snackbarMessage('Field deleted', dispatch)
		} catch (err) {
			handleError(err, dispatch)
		}
	}

	const updateFieldOrderInDB = async fieldIds => {
		try {
			await client.request(UPDATE_FORM_MUTATION, {
				_id: formId,
				formFields: fieldIds,
			})

			snackbarMessage('Updated', dispatch)
		} catch (err) {
			handleError(err, dispatch)
		}
	}

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list)
		const [ removed ] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)

		return result
	}

	const onDragEnd = result => {
		const { destination, source } = result

		if (
			!destination ||
			(destination.droppableId === source.droppableId &&
				destination.index === source.index)
		)
			return

		const newFields = reorder(
			formFields,
			result.source.index,
			result.destination.index,
		)

		const fieldIds = newFields.map(field => field._id)

		setFormFields(newFields)
		updateFieldOrderInDB(fieldIds)
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId={formId}>
				{provided => (
					<FieldContainer ref={provided.innerRef} {...provided.droppableProps}>
						{formFields.map((field, idx) => {
							return (
								<Draggable draggableId={field._id} key={field._id} index={idx}>
									{provided => (
										<FormField
											setIdToDelete={setIdToDelete}
											field={field}
											formId={formId}
											provided={provided}
										/>
									)}
								</Draggable>
							)
						})}
						{provided.placeholder}
					</FieldContainer>
				)}
			</Droppable>
		</DragDropContext>
	)
}

export default Fields
