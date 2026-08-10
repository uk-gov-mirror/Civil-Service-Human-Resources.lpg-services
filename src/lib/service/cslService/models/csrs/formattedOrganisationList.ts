import {Type} from 'class-transformer'
import {CacheableObject} from '../../../../utils/cacheableObject'
import {FormattedOrganisation} from './formattedOrganisation'

export class FormattedOrganisationList implements CacheableObject {
	private _id: string
	@Type(() => FormattedOrganisation)
	public names: FormattedOrganisation[]

	constructor(id: string, names: FormattedOrganisation[]) {
		this._id = id
		this.names = names
	}

	getId(): string {
		return this._id
	}
}
