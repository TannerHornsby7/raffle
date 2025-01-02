import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
    name: 'raffle',
    access: (allow) => ({
        'assets/*': [allow.guest.to(['read'])],
    }),
})
