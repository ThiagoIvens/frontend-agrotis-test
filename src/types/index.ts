export interface PaginatedResponse<T> {
	content: T[];
	pageable: any;
	last: boolean;
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first: boolean;
	numberOfElements: number;
	empty: boolean;
}

export interface LaboratoryDTO {
	id: string;
	name: string;
	registration: string;
	address: string;
	operationCost: number;
	operationFee: number;
	calculatedValue: number;
}

export interface LaboratoryRequestDTO {
	name: string;
	registration: string;
	address: string;
	operationCost: number;
	operationFee: number;
}

export interface LaboratoryReportResponseDTO {
	laboratoryCode: string;
	laboratoryName: string;
	totalLinkedGrowers: number;
	financialValueCalculated: number;
}

export interface FarmsteadDTO {
	id: string;
	name: string;
	address: string;
	registration: string;
	totalAreaInHectares: number;
	taxPerHectare: number;
	calculatedValue: number;
}

export interface FarmsteadRequestDTO {
	name: string;
	registration: string;
	address: string;
	totalAreaInHectares: number;
	taxPerHectare: number;
	growerId?: string;
}

export interface GrowerDTO {
	id: string;
	name: string;
	registration: string;
	address: string;
	laboratoryName: string;
	laboratoryId: string;
	farmsteadIds: string[];
	production: number;
	commissionRate: number;
	calculatedValue: number;
	operationInitialDate: string;
	operationFinalDate: string;
	observations: string;
}

export interface GrowerRequestDTO {
	name: string;
	registration: string;
	address: string;
	production: number;
	commissionRate: number;
	operationInitialDate: string;
	operationFinalDate: string;
	observations: string;
	laboratoryId: string;
	farmsteadIds: string[];
}
