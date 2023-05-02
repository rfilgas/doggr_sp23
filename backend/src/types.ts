export type ICreateUsersBody = {
	name: string,
	email: string,
	petType: string
}

export type messageCreate = {
	sender: string,
	receiver: string,
	message: string
}

export type messageUpdate = {
	messageId: number,
	message: string
}

export type messageDelete = {
	messageId: number
}

export type messageAllDelete = {
	sender: string
}