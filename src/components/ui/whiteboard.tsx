"use client"
import { useYjsStore } from '@/utils/useYjsStore'
import { Tldraw, track, useEditor } from 'tldraw'
import 'tldraw/tldraw.css'
const HOST_URL = 'ws://localhost:1234';

export default function Whiteboard() {
	const store = useYjsStore({
		roomId: 'example17',
		hostUrl: "ws://localhost:1234",
	})
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				store={store}
				components={{
					SharePanel: NameEditor,
				}}

				inferDarkMode
			/>

		</div>
	)
}


const NameEditor = track(() => {
	const editor = useEditor()

	const { color, name } = editor.user.getUserPreferences()

	return (
		<div style={{ pointerEvents: 'all', display: 'flex' }}>
			<input
				type="color"
				value={color}
				onChange={(e) => {
					editor.user.updateUserPreferences({
						color: e.currentTarget.value,
					})
				}}
			/>
			<input
				value={name}
				onChange={(e) => {
					editor.user.updateUserPreferences({
						name: e.currentTarget.value,
					})
				}}
			/>
		</div>
	)
})