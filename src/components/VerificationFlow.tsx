import * as React from "react"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { CheckCircle, Upload, ShieldAlert } from "lucide-react"

interface VerificationFlowProps {
  onComplete: () => void
  theme: 'dark' | 'light'
}

export function VerificationFlow({ onComplete, theme }: VerificationFlowProps) {
  const [step, setStep] = React.useState(1)
  const [docs, setDocs] = React.useState<string[]>([])
  const [isVerified, setIsVerified] = React.useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setDocs(Array.from(files).map(f => f.name))
      setStep(2)
    }
  }

  const verifyDocuments = () => {
    // In a real app, this would call an API for verification
    setTimeout(() => {
      setIsVerified(true)
      setStep(3)
    }, 2000)
  }

  return (
    <div className={`p-6 rounded-lg border ${
      theme === 'dark' ? 'border-[#303974] bg-[#0A155A]/30' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="mb-6">
        <h3 className={`text-lg font-medium mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Women Entrepreneur Verification
        </h3>
        <Progress value={step * 33.33} className="h-2" />
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'
          }`}>
            To verify your identity as a woman entrepreneur, please upload:
          </p>
          <ul className={`text-sm space-y-1 mb-4 ${
            theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'
          }`}>
            <li>- Government-issued ID</li>
            <li>- Business registration documents</li>
            <li>- Proof of ownership (if applicable)</li>
          </ul>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById('verification-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
            <input
              id="verification-upload"
              type="file"
              className="hidden"
              multiple
              onChange={handleFileUpload}
            />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'
          }`}>
            Documents uploaded:
          </p>
          <ul className="space-y-2">
            {docs.map((doc, i) => (
              <li key={i} className={`text-sm p-2 rounded ${
                theme === 'dark' ? 'bg-[#0A155A]/50 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                {doc}
              </li>
            ))}
          </ul>
          <Button className="w-full" onClick={verifyDocuments}>
            Submit for Verification
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 text-center">
          {isVerified ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h4 className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Verification Complete!
              </h4>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'
              }`}>
                Your status as a woman entrepreneur has been verified.
              </p>
              <Button className="mt-4" onClick={onComplete}>
                Continue to Dashboard
              </Button>
            </>
          ) : (
            <>
              <ShieldAlert className="h-12 w-12 text-yellow-500 mx-auto" />
              <h4 className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Verification Pending
              </h4>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'
              }`}>
                Our team is reviewing your documents. This may take 1-2 business days.
              </p>
              <Button variant="outline" className="mt-4" onClick={onComplete}>
                Continue to Dashboard
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
