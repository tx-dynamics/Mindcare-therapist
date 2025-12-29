import { useEffect, useState } from "react";
 import { Method, callApi } from "../netwrok/NetworkManager";
import { api } from "../netwrok/Environment";

const PrivacyPolicy = () => {
  const [terms, setTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setApiError("");

    callApi({
      method: Method.GET,
      endPoint: api.privacyPolicy,
      onSuccess: (response) => {
        const payload = response?.data ?? response;

        if (typeof payload?.privacyPolicy?.content === "string") {
          setTerms(payload.privacyPolicy.content.trim() ? [payload.privacyPolicy.content] : []);
          setIsLoading(false);
          return;
        }

        if (Array.isArray(payload)) {
          setTerms(payload.filter(Boolean));
        } else if (typeof payload === "string") {
          setTerms(payload.trim() ? [payload] : []);
        } else if (payload && typeof payload === "object") {
          const nestedPolicy =
            payload?.privacyPolicy?.content ??
            payload?.data?.privacyPolicy?.content ??
            payload?.privacyPolicy?.privacyPolicy?.content ??
            payload?.policy?.content;

          const content =
            nestedPolicy ??
            payload?.content ??
            payload?.text ??
            payload?.policy ??
            payload?.privacyPolicy?.content ??
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
        setApiError(error?.message || "Failed to load privacy policy.");
        setIsLoading(false);
      },
    });
  }, []);

  return (
    <div className="prose max-w-none text-sm text-gray-700 px-4 py-6">
      <h2 className="text-center text-lg font-semibold mb-4">Privacy Policy</h2>
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

export default PrivacyPolicy;
