import { useEffect, useState } from "react";

const TermCondition = () => {
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    // Simulating API call
    const dummyTerms = [
      `Your term&Condition is important to us. It is Brainstorming's policy to respect your term&Condition regarding any information we may collect from you across our website, and other sites we own and operate. We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
      
We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.

We don’t share any personally identifying information publicly or with third-parties, except when required to by law.Your term&Condition is important to us. It is Brainstorming's policy to respect your term&Condition regarding any information we may collect from you across our website, and other sites we own and operate. We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
      
We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.

We don’t share any personally identifying information publicly or with third-parties, except when required to by law.`
    ];
    setTerms(dummyTerms);
  }, []);

  return (
    <div className="prose max-w-none text-sm text-gray-700 px-4 py-6">
      <h2 className="text-center text-lg font-semibold mb-4">Term & Condition</h2>
      {terms.map((term, idx) => (
        <p className="text-[#92979D] whitespace-pre-line" key={idx}>
          {term}
        </p>
      ))}
    </div>
  );
};

export default TermCondition;
