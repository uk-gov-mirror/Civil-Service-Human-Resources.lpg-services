import {Type} from 'class-transformer'
import {FormattedOrganisation} from './formattedOrganisation'

export class FormattedOrganisations {
	@Type(() => FormattedOrganisation)
	public names: FormattedOrganisation[]
}
