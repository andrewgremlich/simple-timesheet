export const Section = ({ children }: { children: React.ReactNode }) => {
	return <section className="mt-8 mb-6">{children}</section>;
};

export const H1 = ({ children }: { children: React.ReactNode }) => {
	return <h1 className="text-3xl font-bold mb-6">{children}</h1>;
};

export const H2 = ({ children }: { children: React.ReactNode }) => {
	return <h2 className="text-2xl font-bold mb-4">{children}</h2>;
};

export const H3 = ({ children }: { children: React.ReactNode }) => {
	return <h3 className="text-xl font-bold mb-2">{children}</h3>;
};

export const P = ({ children }: { children: React.ReactNode }) => {
	return <p className="text-gray-700 mb-4">{children}</p>;
};
