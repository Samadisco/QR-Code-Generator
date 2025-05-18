"use client";

import type { ChangeEvent, CSSProperties } from 'react';
import React, { useState, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import { Download, Settings2, Type, LinkIcon, Palette, TextCursorInput, Move } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { FONT_FAMILIES, type FontOption } from '@/lib/fonts';
import { downloadFile } from '@/lib/download';

const QrCodeGenerator: React.FC = () => {
  const { toast } = useToast();
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState<string>('https://example.com');
  const [labelText, setLabelText] = useState<string>('Scan Me!');
  const [labelColor, setLabelColor] = useState<string>('#000000');
  const [labelFontSize, setLabelFontSize] = useState<number>(20);
  const [labelFontFamily, setLabelFontFamily] = useState<string>(FONT_FAMILIES[0].value);
  const [labelXOffset, setLabelXOffset] = useState<number>(0);
  const [labelYOffset, setLabelYOffset] = useState<number>(5); // Initial small gap below QR

  const [qrCodeSize, setQrCodeSize] = useState<number>(256);
  const [qrBgColor, setQrBgColor] = useState<string>('#FFFFFF');
  const [qrFgColor, setQrFgColor] = useState<string>('#000000');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDownload = useCallback(async (format: 'png' | 'jpeg' | 'svg') => {
    if (!qrContainerRef.current) {
      toast({ title: 'Error', description: 'QR code element not found.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const element = qrContainerRef.current;
    const filename = `qr-code-${Date.now()}.${format}`;

    try {
      let dataUrl: string;
      if (format === 'svg') {
        dataUrl = await htmlToImage.toSvg(element, { backgroundColor: qrBgColor });
      } else if (format === 'png') {
        dataUrl = await htmlToImage.toPng(element, { backgroundColor: qrBgColor });
      } else { // jpeg
        dataUrl = await htmlToImage.toJpeg(element, { backgroundColor: qrBgColor, quality: 0.95 });
      }
      downloadFile(dataUrl, filename);
      toast({ title: 'Success!', description: `QR Code downloaded as ${format.toUpperCase()}.` });
    } catch (error) {
      console.error('Download error:', error);
      toast({ title: 'Download Failed', description: 'Could not generate QR code image.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [qrBgColor, toast]);
  
  const labelStyle: CSSProperties = {
    color: labelColor,
    fontSize: `${labelFontSize}px`,
    fontFamily: labelFontFamily,
    transform: `translate(${labelXOffset}px, ${labelYOffset}px)`,
    textAlign: 'center',
    marginTop: '0.5rem', // Default spacing if Y offset is 0
    maxWidth: `${qrCodeSize}px`,
    wordBreak: 'break-word', // Changed from wordWrap for CSSProperties
    lineHeight: '1.2',
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-5xl">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M5 5h4v4H5zM5 15h4v4H5zM15 5h4v4h-4zM15 15h4v4h-4zM10 5h4M10 19h4M5 10v4M19 10v4M10 10h4v4h-4z"/></svg>
            QR Code Suite
          </CardTitle>
          <CardDescription>Generate and customize your QR codes with ease.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="content" className="flex items-center text-lg mb-2 font-medium"><LinkIcon className="mr-2 h-5 w-5 text-primary" />QR Code Content (URL or Text)</Label>
              <Input id="content" value={content} onChange={(e: ChangeEvent<HTMLInputElement>) => setContent(e.target.value)} placeholder="https://your-link.com or Your Text" className="text-base"/>
            </div>

            <Separator />

            <h3 className="text-xl font-semibold flex items-center"><TextCursorInput className="mr-2 h-6 w-6 text-primary"/>Label Customization</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="labelText" className="font-medium">Label Text</Label>
                <Input id="labelText" value={labelText} onChange={(e: ChangeEvent<HTMLInputElement>) => setLabelText(e.target.value)} placeholder="Scan Me!" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="labelColor" className="font-medium flex items-center"><Palette className="mr-2 h-4 w-4"/>Color</Label>
                  <Input id="labelColor" type="color" value={labelColor} onChange={(e: ChangeEvent<HTMLInputElement>) => setLabelColor(e.target.value)} className="h-10 p-1" />
                </div>
                <div>
                  <Label htmlFor="labelFontSize" className="font-medium">Font Size ({labelFontSize}px)</Label>
                  <Slider id="labelFontSize" min={8} max={72} step={1} value={[labelFontSize]} onValueChange={(value) => setLabelFontSize(value[0])} />
                </div>
              </div>
              <div>
                <Label htmlFor="labelFontFamily" className="font-medium">Font Family</Label>
                <Select value={labelFontFamily} onValueChange={setLabelFontFamily}>
                  <SelectTrigger id="labelFontFamily"><SelectValue placeholder="Select font" /></SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font: FontOption) => (
                      <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <Label htmlFor="labelXOffset" className="font-medium flex items-center"><Move className="mr-2 h-4 w-4 transform rotate-90"/>X Offset ({labelXOffset}px)</Label>
                  <Input id="labelXOffset" type="number" value={labelXOffset} onChange={(e) => setLabelXOffset(parseInt(e.target.value, 10) || 0)} />
                </div>
                <div>
                  <Label htmlFor="labelYOffset" className="font-medium flex items-center"><Move className="mr-2 h-4 w-4"/>Y Offset ({labelYOffset}px)</Label>
                  <Input id="labelYOffset" type="number" value={labelYOffset} onChange={(e) => setLabelYOffset(parseInt(e.target.value, 10) || 0)} />
                </div>
              </div>
            </div>

            <Separator />
            
            <h3 className="text-xl font-semibold flex items-center"><Settings2 className="mr-2 h-6 w-6 text-primary"/>QR Code Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="qrCodeSize" className="font-medium">QR Size ({qrCodeSize}px)</Label>
                <Slider id="qrCodeSize" min={64} max={1024} step={16} value={[qrCodeSize]} onValueChange={(value) => setQrCodeSize(value[0])} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qrFgColor" className="font-medium flex items-center"><Palette className="mr-2 h-4 w-4"/>Pattern Color</Label>
                  <Input id="qrFgColor" type="color" value={qrFgColor} onChange={(e) => setQrFgColor(e.target.value)} className="h-10 p-1"/>
                </div>
                <div>
                  <Label htmlFor="qrBgColor" className="font-medium flex items-center"><Palette className="mr-2 h-4 w-4"/>Background Color</Label>
                  <Input id="qrBgColor" type="color" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)} className="h-10 p-1"/>
                </div>
              </div>
            </div>
          </div>

          {/* Preview and Download Section */}
          <div className="flex flex-col items-center justify-center space-y-6 p-4 rounded-lg bg-secondary/30">
            <div
              ref={qrContainerRef}
              className="inline-block p-4 rounded-md transition-all duration-300"
              style={{ backgroundColor: qrBgColor }}
            >
              <QRCodeSVG
                value={content}
                size={qrCodeSize}
                bgColor="rgba(0,0,0,0)" // Transparent, parent div bg will show
                fgColor={qrFgColor}
                level="H" // High error correction
                includeMargin={true}
              />
              {labelText && (
                <p style={labelStyle}>
                  {labelText}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
              <Button onClick={() => handleDownload('png')} disabled={isLoading} variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="mr-2 h-4 w-4" /> {isLoading ? 'Generating...' : 'PNG'}
              </Button>
              <Button onClick={() => handleDownload('jpeg')} disabled={isLoading} variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="mr-2 h-4 w-4" /> {isLoading ? 'Generating...' : 'JPG'}
              </Button>
              <Button onClick={() => handleDownload('svg')} disabled={isLoading} variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="mr-2 h-4 w-4" /> {isLoading ? 'Generating...' : 'SVG'}
              </Button>
            </div>
             <p className="text-xs text-muted-foreground">Tip: Higher error correction (Level H) makes QR codes more robust.</p>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p>Powered by Next.js & ShadCN UI. Designed for clarity and ease of use.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QrCodeGenerator;
