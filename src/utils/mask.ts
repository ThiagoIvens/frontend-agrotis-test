export const maskCpfCnpj = (value: string) => {
	const numericValue = value.replace(/\D/g, "");
	if (numericValue.length <= 11) {
		return numericValue
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d{1,2})/, "$1-$2")
			.replace(/(-\d{2})\d+$/, "$1");
	} else {
		return numericValue
			.replace(/^(\d{2})(\d)/, "$1.$2")
			.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
			.replace(/\.(\d{3})(\d)/, ".$1/$2")
			.replace(/(\d{4})(\d)/, "$1-$2")
			.substring(0, 18);
	}
};

export const formatDate = (dateStr?: string) => {
	if (!dateStr) return "-";
	const parts = dateStr.split("-");
	if (parts.length === 3) {
		return `${parts[2]}/${parts[1]}/${parts[0]}`;
	}
	return dateStr;
};

export const formatCurrency = (value: number) => {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
};
