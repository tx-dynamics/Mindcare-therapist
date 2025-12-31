import { useEffect, useState } from "react";
import { Method, callApi } from "../netwrok/NetworkManager";
import { api } from "../netwrok/Environment";

const TermCondition = () => {
  const [terms, setTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const language = (navigator?.language || "en").split("-")[0] || "en";

    setIsLoading(true);
    setApiError("");

    callApi({
      method: Method.GET,
      endPoint: api.termsAndConditions,
      headers: { "Accept-Language": language },
      onSuccess: (response) => {
        const payload = response?.data ?? response;

        if (typeof payload?.terms?.content === "string") {
          setTerms(payload.terms.content.trim() ? [payload.terms.content] : []);
          setIsLoading(false);
          return;
        }

        if (Array.isArray(payload)) {
          setTerms(payload.filter(Boolean));
        } else if (typeof payload === "string") {
          setTerms(payload.trim() ? [payload] : []);
        } else if (payload && typeof payload === "object") {
          const nestedTerms =
            payload?.termsAndConditions?.content ??
            payload?.terms?.content ??
            payload?.data?.termsAndConditions?.content ??
            payload?.data?.terms?.content ??
            payload?.privacyPolicy?.content ??
            payload?.data?.privacyPolicy?.content;

          const content =
            nestedTerms ??
            payload?.content ??
            payload?.text ??
            payload?.terms ??
            payload?.termsAndConditions ??
            payload?.privacyPolicy ??
            payload?.description;

          if (Array.isArray(content)) setTerms(content.filter(Boolean));
          else if (typeof content === "string") setTerms(content.trim() ? [content] : []);
          else setTerms([]);
        } else {
          setTerms([]);
        }

        setIsLoading(false);
      },
      onError: (error) => {
        setApiError(error?.message || "Failed to load terms & conditions.");
        setIsLoading(false);
      },
    });
  }, []);

  return (
    <div className="prose max-w-none text-sm text-gray-700 px-4 py-6">
      <h2 className="text-center text-lg font-semibold mb-4">Terms & Condition</h2>
      {isLoading && <p className="text-[#92979D]">Loading...</p>}
      {!isLoading && apiError && <p className="text-red-500">{apiError}</p>}
      {terms.map((term, idx) => (
        <p className="text-[#92979D] whitespace-pre-line" key={idx}>
          {term}
        </p>
      ))}
    </div>
  );
};

export default TermCondition;
