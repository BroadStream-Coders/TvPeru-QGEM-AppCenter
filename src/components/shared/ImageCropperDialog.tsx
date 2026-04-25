import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import getCroppedImg from "@/lib/cropImage";

interface ImageCropperDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  aspectRatio: number;
  fileType?: string;
  onConfirm: (croppedBlob: Blob, croppedUrl: string) => void;
}

export function ImageCropperDialog({
  isOpen,
  onClose,
  imageSrc,
  aspectRatio,
  fileType = "image/jpeg",
  onConfirm,
}: ImageCropperDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        0,
        fileType,
      );
      const croppedUrl = URL.createObjectURL(croppedImageBlob);
      onConfirm(croppedImageBlob, croppedUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-xl p-0 overflow-hidden bg-background border-border shadow-2xl"
      >
        <DialogHeader className="p-4 bg-muted/20 border-b border-border">
          <DialogTitle className="text-lg font-bold text-foreground">
            Ajustar imagen
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[400px] bg-black/90">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            classes={{
              containerClassName: "rounded-sm",
            }}
          />
        </div>

        <div className="p-6 bg-muted/10 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="py-2"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="bg-brand text-brand-foreground hover:bg-brand/90 shadow-brand/20 shadow-lg"
            >
              {isProcessing ? "Recortando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
