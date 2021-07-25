import Joi from 'joi'

export const recommendationSchema = Joi.object({
    name:Joi.string().required(),
    youtubeLink: Joi.string().pattern(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)
})