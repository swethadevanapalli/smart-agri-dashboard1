import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyzeCropImage } from '@/lib/mockData';
import { CropHealthAnalysis } from '@/types/agriculture';

export default function CropHealthAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CropHealthAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      setSelectedImage(event.target?.result as string);
      setIsAnalyzing(true);
      setAnalysis(null);

      try {
        const result = await analyzeCropImage(file);
        setAnalysis(result);
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-6 w-6 text-primary" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-accent" />;
      case 'critical':
        return <XCircle className="h-6 w-6 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-primary bg-primary/5';
      case 'warning':
        return 'border-accent bg-accent/5';
      case 'critical':
        return 'border-destructive bg-destructive/5';
      default:
        return 'border-border';
    }
  };

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ImageIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>AI Crop Health Analyzer</CardTitle>
            <CardDescription>Upload crop images for disease detection</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {!selectedImage ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-80 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center gap-4 bg-muted/30 hover:bg-muted/50 group"
              >
                <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">Upload Crop Image</p>
                  <p className="text-sm text-muted-foreground mt-1">Click to browse or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG (Max 10MB)</p>
                </div>
              </button>
            ) : (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Uploaded crop"
                  className="w-full h-80 object-cover rounded-lg border border-border"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-4"
                >
                  Change Image
                </Button>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div>
            {isAnalyzing ? (
              <div className="h-80 flex flex-col items-center justify-center gap-4 bg-muted/30 rounded-lg">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-lg font-medium text-foreground">Analyzing crop health...</p>
                <p className="text-sm text-muted-foreground">Processing image with AI model</p>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div className={`p-6 rounded-lg border-2 ${getStatusColor(analysis.status)}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {getStatusIcon(analysis.status)}
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {analysis.disease || 'Healthy Crop'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {analysis.confidence}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div
                      className={`h-2 rounded-full ${
                        analysis.status === 'healthy' ? 'bg-primary' :
                        analysis.status === 'warning' ? 'bg-accent' :
                        'bg-destructive'
                      }`}
                      style={{ width: `${analysis.confidence}%` }}
                    />
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center gap-4 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">No Analysis Yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Upload an image to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <InfoCard
            title="Supported Crops"
            value="15+"
            description="Wheat, Rice, Corn, Tomato, Potato, and more"
          />
          <InfoCard
            title="Detection Accuracy"
            value="92%"
            description="Using state-of-the-art deep learning models"
          />
          <InfoCard
            title="Disease Database"
            value="50+"
            description="Common crop diseases and deficiencies"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="bg-muted/30 rounded-lg p-4 border border-border">
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold text-primary mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
