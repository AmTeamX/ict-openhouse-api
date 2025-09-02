import type { Document, Model } from 'mongoose'
import { Schema, model } from 'mongoose'
import { Evaluation as EvaluationEntity } from '~/types/models/Evaluation'

export type EvaluationDocument = Document & EvaluationEntity

const evaluationSchema = new Schema(
    {
        participant: {
            type: Schema.Types.ObjectId,
            ref: 'Participant',
        },
        role: String,
        channels: [String],
        'date-and-time-rating': String,
        'location-rating': String,
        'stage-rating': String,
        'booths-rating': String,
        'project-rating': String,
        'guidance-rating': String,
        'intl-exp-rating': String,
        'benefit-rating': String,
        'overall-rating': String,
        'interest-rating': String,
        'interested-programs': [String],
        factors: [String],
        impressed: String,
        unimpressed: String,
        recommended: String,
        'other-suggestions': String,
    },
    { timestamps: true },
)

const Evaluation: Model<EvaluationDocument> = model<EvaluationDocument>(
    'Evaluation',
    evaluationSchema,
)

export default Evaluation
