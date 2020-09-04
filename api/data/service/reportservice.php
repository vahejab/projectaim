<?php
    namespace data\service\reportservice;

    require_once 'c:/wamp64/www/projectaim/api/libraries/PhpPresentation/vendor/autoload.php';
    use PhpOffice\PhpPresentation\PhpPresentation;
    use PhpOffice\PhpPresentation\IOFactory;
    use PhpOffice\PhpPresentation\Style\Alignment;
    use PhpOffice\PhpPresentation\Style\Color;
    use PhpOffice\PhpPresentation\Style\Fill;
    use PhpOffice\PhpPresentation\Style\Border;
    use PhpOffice\PhpPresentation\Shape\RichText;
    use \ArrayAccess;
    
    define ('BASELINE', 0);
    define ('ACTUAL', 1);
    define ('SCHEDULE', 2);
    define ('MARKER', 3);    
    
    class Cell
    {
        public $startX;
        public $startY;                                                     
        
        public $maxIdxX;
        public $maxIdxY;
        
        public $centerX;
        public $centerY;
        
        public $startCenterX;
        public $startCenterY;
       
        public $color;
        
        public $val;
        
        public function __construct($idxX, $idxY, $width, $height, $startCoordX, $startCoordY, $maxIdxX, $maxIdxY, $centerX, $centerY, $startCenterX, $startCenterY)
        {
            $this->startX = $startCoordX + $width*($idxX - 1);
            $this->startY = $startCoordX + $height*($maxIdxY - $idxY + 1);
            
            $this->maxIdxX = $maxIdxX;
            $this->maxIdxY = $maxIdxY;
            
            $this->centerX = $centerX;
            $this->centerY = $centerY;
            
            $this->startCenterX = $startCenterX;
            $this->startCenterY = $startCenterY;
            
            $this->setAutoCellValue($idxX, $idxY);
            
            return $this;
        }
                                      
        private function setAutoCellValue($x, $y)
        {
            if ($this->maxIdxX == 0 || $this->maxIdxY == 0)
                return 0;
                
            $cellVal = $x*$y;
            $maxVal = $this->maxIdxX * $this->maxIdxY;
            $ratio = $cellVal/$maxVal;
            $scale = 0.9;
            $offset = 0.05;
            $this->val =  $scale*$ratio + $offset;
        }                                   
    }

    class Matrix implements \ArrayAccess
    {
        protected $minX;
        protected $minY;
        protected $maxX;
        protected $maxY;
        
        private $matrix = array();
        public function __construct($minX, $minY, $maxX, $maxY)
        {
            $this->minX = $minX;
            $this->minY = $minY;
            
            $this->maxX = $maxX;
            $this->maxY = $maxY;
            
            $initIdxX = 0;
            $initIdxY = 0;
            $initWidth = 0;
            $initHeight = 0;
            $startCoordX = 0;
            $startCoordY = 0;
            $maxIdxX = 0;
            $maxIdxY = 0;
            $centerX = 0;
            $centerY = 0;
            $startCenterX = 0;
            $startCenterY = 0;
            
            $cell = new Cell($initIdxX,
                $initIdxY,
                $initWidth,
                $initHeight,
                $startCoordX,
                $startCoordY,
                $maxIdxX,
                $maxIdxY,
                $centerX, 
                $centerY,
                $startCenterX,
                $startCenterY
            );
            $this->matrix = array_fill($minX, $maxX, array_fill($minY, $maxY, $cell));
            return $this;
        }
        
        public function getMaxX()
        {
            return $this->maxX;
        }
        
        public function getMaxY()
        {
            return $this->maxY;
        }
        
        public function &offsetGet($name)
        {
            return $this->matrix[$name];
        }
        
        public function &offsetSet($name, $value) 
        {
            $this->matrix[$name] = $value;
        }
        
        public function offsetExists($name)
        {
            return isset($this->matrix[$name]);
        }

        public function offsetUnset($name)
        {
            unset($this->matrix[$name]);
        }
        
      
        public function get($x, $y) : Cell
        {
            for ($x = $this->minX; $x < $this->maxX; $x++)
            {
                for ($y = $this->minY; $y < $this->maxY; $y++)
                {
                    if (!(array_key_exists($x, $this->matrix) && array_key_exists($y, $this->matrix[$x])))
                    {
                        throw new OutOfBoundsException("\$matrix[$x][$y] is out of bounds!");
                    }
                }
            }
            
            return $this->matrix[$x][$y];
        }
    }
    
    
    class Point
    {
        private $x;
        private $y;
        
        public function __construct($x, $y)
        {
            $this->x = $x;
            $this->y = $y;
        }
        
        public function __get($prop)
        {
            if ($prop == 'x')
                return $this->x;
            else if ($prop == 'y')
                return $this->y;
        }
    }

    interface IReport
    {        
        //public function generatePPT();
        //public function generateDOC();
        //public function generateXLS();
    }


    class RiskReport implements IReport
    {  
        public static $minLikelihood = 1;
        public static $minConsequence = 1;
        public static $maxLikelihood = 5;
        public static $maxConsequence = 5;
     
        private static $eventColor = '000000';
        private static $borderColor = '000000';
        private static $waterfallWidth = 520;
        private static $waterfallHeight = 200;
        private static $offsetWaterfallX = 350;
        private static $offsetWaterfallY = 120;
        private static $waterfallLabelWidth = 40; 
    
        private static $yAxisBoxWidth = 20;
        private static $yAxisBoxHeight = 40;
        private static $xAxisBoxHeight = 20; 
        private static $xAxisBoxWidth = 40;           
         
        private static $red = 'ee0000';
        private static $yellow = 'eeee00';
        private static $green = '00b050';
        private static $white = 'ffffff';
          
        private static $matrixHeight = 200;
        private static $matrixWidth = 200;
        
        private static $cellWidth = 40;
        private static $cellHeight = 40;
        private static $matrixStartX = 80;
        private static $matrixStartY = 120;  

        private static $eventWidth = 4;
        private static $eventHeight = 4;

        private static $maxYearsXAxis = 10;
        private static $maxMonthsXAxis = 7;
        private static $maxDaysXAxis = 30;
               
        private $minHigh;
        private $maxLow;
       
        private $matrix;
        
        private $riskPPT;
        private $activeSlide;
        
        private $numYears;
        private $numMonths;
        private $numDays;
         
        private $labelOffset;
        
        public function __construct($minHigh, $maxLow, $startDate, $endDate)
        {
            $this->minHigh = $minHigh;
            $this->maxLow = $maxLow;
            
            $this->numYears = 0;
            $this->numMonths = 0;
            $this->numDays = 0;
            
            $this->labelOffset = 0;
            
            $this->startDate = $startDate;
            $this->endDate = $endDate;
            
            $this->riskPPT = $this->createPhpPresentation();
            $this->activeSlide = $this->getActiveSlide();
            
            $this->creatematrix();                           
        }  
        
        public function color($risk)
        {
            if ($risk <= 1 && $risk >= $this->minHigh)
                return self::$red;
            else if ($risk < $this->minHigh && $risk >= $this->maxLow)
                return self::$yellow;
            else if ($risk > 0)
                return self::$green;
            else 
                return self::$white;
        }
        
        public function getRisk($likelihood, $consequence)
        {
            if ($likelihood == ' ' || $consequence == ' ')
                return 0;
                
            $scale = 0.9;
            $riskRatio = $likelihood*$consequence/(self::$maxLikelihood*self::$maxConsequence);
            $offset = 0.05;
            $risk = $scale*$riskRatio+$offset;
            return $risk;
        }
                
        private function createMatrix()
        {
            $this->matrix = new Matrix(self::$minLikelihood, self::$minConsequence, self::$maxLikelihood, self::$maxConsequence);
              
            for ($likelihood = 1; $likelihood <= $this->matrix->getMaxY(); $likelihood++)
            {
                for ($consequence = 1; $consequence <= $this->matrix->getMaxX(); $consequence++)
                {
                    $width = self::$cellWidth;
                    $height = self::$cellHeight;
                    $offsetX = self::$matrixStartX;
                    $offsetY = self::$matrixStartY;
            
                    $halfWidth = self::$cellWidth / 2;
                    $halfHeight = self::$cellHeight / 2; 
                    
                    $centerX = $offsetX +$consequence*$width- $halfWidth;
                    $reverseLikelihood = self::$maxLikelihood + 1 - $likelihood;
                    $centerY = $offsetY + ($reverseLikelihood)*$height - $halfHeight; 
            
                    $startPointX = $centerX - self::$eventWidth / 2; 
                    $startPointY = $centerY - self::$eventHeight / 2;
                    
                    $this->matrix[$likelihood][$consequence] = new Cell($likelihood, 
                                                                        $consequence, 
                                                                        $width, 
                                                                        $height, 
                                                                        $offsetX, 
                                                                        $offsetY, 
                                                                        $this->matrix->getMaxX(), 
                                                                        $this->matrix->getMaxY(), 
                                                                        $centerX, 
                                                                        $centerY, 
                                                                        $startPointX, 
                                                                        $startPointY);
                }
            }
        }
        
        private function createPhpPresentation()
        {
            return new PHPPresentation();
        }
        
        public function matrix($x, $y)
        {
            return $this->matrix[$x][$y];                         
        }
        
        public function getActiveSlide()
        {
            return $this->riskPPT->getActiveSlide();
        } 
        
        
        public function generateRiskPresentationTitle($riskNumber, $title)
        {
            $currentSlide = $this->riskPPT->getActiveSlide();
            
           
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(40)
                                  ->setWidth(919);
                                  
                
            $shape->setOffsetX(20);
            $shape->setOffsetY(25);
            $textRun = $shape->createTextRun("Risk $riskNumber");      
            $textRun->getFont()->setSize(14);  
            $textRun->getFont()->setBold(true);         
                
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER);
            
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setVertical(Alignment::VERTICAL_CENTER);    
            
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(25)
                                  ->setWidth(919);
                                  
                               
                                  
            $shape->setOffsetX(20);
            $shape->setOffsetY(50);
            $textRun = $shape->createTextRun($title);      
            $textRun->getFont()->setSize(14);  
            $textRun->getFont()->setBold(true);         
                
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER);
            
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setVertical(Alignment::VERTICAL_CENTER);    
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(25)
                                  ->setWidth(919);    //swap width, height for rotation (90 degrees)
        }
        
        
        public function generateRiskMatrixAxisBoxesLabels()
        {  
            $yAxisBoxXOffset = self::$matrixStartX - self::$yAxisBoxWidth;
            $currentSlide = $this->riskPPT->getActiveSlide();
                
            //Set Y Axis Likelihood Labels
            for ($likelihood = 1; $likelihood <= self::$maxLikelihood; $likelihood++)
            {
                $shape = $currentSlide->createRichTextShape()
                                      ->setHeight(self::$cellHeight)
                                      ->setWidth(self::$yAxisBoxWidth);
                $shape->setOffsetX($yAxisBoxXOffset);  
                $reverseLikelihood = self::$maxLikelihood-$likelihood;
                $yAxisBoxYOffset = self::$matrixStartY+(self::$yAxisBoxHeight*$reverseLikelihood);
                 
                $shape->setOffsetY($yAxisBoxYOffset);
                $textRun = $shape->createTextRun($likelihood);         
                
                $shape->getActiveParagraph()->getAlignment()
                                            ->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $shape->getActiveParagraph()->getAlignment()
                                            ->setVertical(Alignment::VERTICAL_CENTER);    
                $shape->getBorder()->setColor(new Color('FF000000'))
                                   ->setLineStyle(Border::LINE_SINGLE);
            }
                          
            //Set X Axis Consequence Labels
            for ($consequence = 1; $consequence <= self::$maxConsequence; $consequence++)
            {
                $shape = $currentSlide->createRichTextShape()
                                      ->setHeight(self::$xAxisBoxHeight)
                                      ->setWidth(self::$cellWidth);
                                      
                $offsetX = self::$matrixStartX + self::$cellWidth*($consequence-1);
                
                $offsetY = self::$maxLikelihood*self::$cellHeight 
                         + self::$matrixStartY;
                
                $shape->setOffsetX($offsetX);       
                $shape->setOffsetY($offsetY);
                
                $textRun = $shape->createTextRun($consequence);         
                
                $shape->getActiveParagraph()
                      ->getAlignment()
                      ->setHorizontal(Alignment::HORIZONTAL_CENTER);
                
                $shape->getActiveParagraph()
                      ->getAlignment()
                      ->setVertical(Alignment::VERTICAL_CENTER);    
                
                $shape->getBorder()
                      ->setColor(new Color('FF000000'))
                      ->setLineStyle(Border::LINE_SINGLE);    
            }
        }
        
        public function generateRiskMatrix()
        {
            $currentSlide = $this->riskPPT->getActiveSlide();
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(self::$matrixStartY)
                                  ->setWidth(self::$matrixStartX);
            $shape->setOffsetX(self::$matrixStartX);
            $shape->setOffsetY(self::$matrixStartY);
            
            for ($likelihood = 1; $likelihood <= $this->matrix->getMaxY(); $likelihood++)
            {
                for ($consequence = 1; $consequence <= $this->matrix->getMaxX(); $consequence++)
                {   
                    $width = self::$cellWidth;
                    $height = self::$cellHeight;
                    $shape = $currentSlide->createRichTextShape()
                                          ->setHeight($width)
                                          ->setWidth($height);
                    
                    $startX = self::$matrixStartX;
                    $startY = self::$matrixStartY;
                    $shape->setOffsetX($startX + ($consequence-1)*$width);
                    $reverseLikelihood = (self::$maxLikelihood - $likelihood);
                    $shape->setOffsetY($startY + $reverseLikelihood*$height);
            
                    $shape->getActiveParagraph()
                          ->getAlignment()
                          ->setHorizontal(Alignment::HORIZONTAL_CENTER);
                    $shape->getActiveParagraph()
                          ->getAlignment()
                          ->setVertical(Alignment::VERTICAL_CENTER);
                   
                    $risk = $this->matrix[$likelihood][$consequence]->val;  
                    $cellColor = $this->color($risk);
                    $color = new Color('FF'.$cellColor);
                   
                    $shape->getFill()
                          ->setFillType(Fill::FILL_SOLID)
                          ->setStartColor($color)
                          ->setEndColor($color);
                    $shape->getBorder()
                          ->setColor(new Color('FF000000'))
                          ->setLineStyle(Border::LINE_SINGLE);
                }
            }
        }                   
        
        public function getPointFill($category)
        {
            return ($category == ACTUAL)?
                        Fill::FILL_SOLID:
                   ($category == BASELINE)?
                        Fill::FILL_NONE :
                   ($category == SCHEDULE)?
                        Fill::FILL_NONE : Fill::FILL_NONE;;
        }
        public function getPointBorder($category)
        {
           return ($category == ACTUAL)?
                        Border::LINE_SINGLE:
                   ($category == BASELINE)?
                        Border::LINE_NONE :
                   ($category == SCHEDULE)?
                        Border::LINE_SINGLE : Border::LINE_NONE;
        }
        
        
          public function getLineFill($category)
        {
            return ($category == ACTUAL)?
                        Fill::FILL_SOLID:
                   ($category == BASELINE)?
                        Fill::FILL_NONE :
                   ($category == SCHEDULE)?
                        Fill::FILL_NONE : FILL::FILL_SOLID;
        }
        
        public function getCategoryLine($category)
        {
           return ($category == ACTUAL)?
                        Border::LINE_SINGLE:
                   ($category == BASELINE)?
                        Border::LINE_DOUBLE 
                   : Border::LINE_SINGLE;
        }
                
        public function generatePoint($category, $likelihood, $consequence, $label = '')
        {
            if ($likelihood == ' ' || $consequence == ' ')
                return;
            
            $currentSlide = $this->riskPPT->getActiveSlide();
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(self::$eventHeight)
                                  ->setWidth(self::$eventWidth);
        
            $shape->setOffsetX($this->matrix($likelihood, $consequence)->startCenterX);
            $shape->setOffsetY($this->matrix($likelihood, $consequence)->startCenterY);
            
            $color = new Color('FF'.self::$eventColor);
          
            $shape->getFill()
                  ->setFillType($this->getPointFill($category))
                  ->setStartColor($color)
                  ->setEndColor($color);
          
       
            $shape->getBorder()
                  ->setColor(new Color('FF000000'))
                  ->setLineStyle($this->getPointBorder($category));
                  
                  
                  
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(7)
                                  ->setWidth(35);
            $textRun = $shape->createTextRun($label);                      
            if ($category == ACTUAL)
            {
                $shape->setOffsetX($this->matrix($likelihood, $consequence)->startCenterX-20);
                $shape->setOffsetY($this->matrix($likelihood, $consequence)->startCenterY-10);      
                $textRun->getFont()->setSize(6);  
                $textRun->getFont()->setBold(true);  
       
            }
            if ($category == BASELINE)
            {
                $shape->setOffsetX($this->matrix($likelihood, $consequence)->startCenterX-20);
                $shape->setOffsetY($this->matrix($likelihood, $consequence)->startCenterY-2);     
                $textRun->getFont()->setSize(6);  
                $textRun->getFont()->setBold(true);     
            }   
            if ($category == SCHEDULE)
            {
                $shape->setOffsetX($this->matrix($likelihood, $consequence)->startCenterX-5);
                $shape->setOffsetY($this->matrix($likelihood, $consequence)->startCenterY-2);      
                $textRun->getFont()->setSize(6);  
                $textRun->getFont()->setBold(true);     
            }   
                
            $textRun->getFont()->setColor(new Color('FF000000'));   
       
        }
        
        public function renderWaterfallPoint($category, $point, $label='')
        {
            $dateOffset = $point->x;
            $riskOffset = $point->y;
            
            $currentSlide = $this->riskPPT->getActiveSlide();
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(self::$eventHeight)
                                  ->setWidth(self::$eventWidth);
           
                          
            $shape->setOffsetX($dateOffset - self::$eventWidth/2);
            $shape->setOffsetY($riskOffset - self::$eventHeight/2);
            $color = new Color('FF'.self::$eventColor);
            
            $shape->getFill()
                  ->setFillType($this->getPointFill($category))
                  ->setStartColor($color)
                  ->setEndColor($color);
            
            $shape->getBorder()
                  ->setColor(new Color('FF000000'))
                  ->setLineStyle($this->getPointBorder($category));
                  
                  
            $currentSlide = $this->riskPPT->getActiveSlide();
            
           
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(7)
                                  ->setWidth(35);
                                  
            if ($category == ACTUAL)
            {
                $shape->setOffsetX($dateOffset-22);
                $shape->setOffsetY($riskOffset-10);
                $textRun = $shape->createTextRun($label);      
                $textRun->getFont()->setSize(6);  
                $textRun->getFont()->setBold(true);     
            }
            if ($category == BASELINE)
            {
                $shape->setOffsetX($dateOffset-12);
                $shape->setOffsetY($riskOffset-10);
                $textRun = $shape->createTextRun($label);      
                $textRun->getFont()->setSize(6);  
                $textRun->getFont()->setBold(true);     
            }   
            if ($category == SCHEDULE)
            {
                $shape->setOffsetX($dateOffset-11);
                $shape->setOffsetY($riskOffset+1);
                $textRun = $shape->createTextRun($label);      
                $textRun->getFont()->setSize(6);  
                $textRun->getFont()->setBold(true);     
            }   
                
                
                
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER);
            
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setVertical(Alignment::VERTICAL_CENTER);    
             
        }
        
        public function generateWaterfallPoint($date, $value)
        {   
            $y = preg_split('/-/', $this->startDate)[0];
            $m = preg_split('/-/', $this->startDate)[1];   
                    
            $date1 = new \DateTime($date);
            $date0 = new \DateTime($this->startDate);
            $dayOffset = $date1->diff($date0)->days;
            $midOffset = 0;
            
            $labelWidthRegion = (self::$waterfallWidth-$this->labelOffset*2);
            
            if ($dayOffset > 31 || $this->numMonths > 0)
            {   
                $date0 = new \DateTime("$y-$m-01");
                $dayOffset = $date1->diff($date0)->days;
            }                                  
            if ($this->numYears >= 2)
            {  
                $startDate0 = preg_split('/-/', $this->startDate)[0].'-01-01';
                $dayOffset = $date1->diff(new \DateTime($startDate0))->days;
                $startOfYearDate1 = preg_split('/-/', $date)[0].'-01-01'; 
                $extraDays = $date1->diff(new \DateTime($startOfYearDate1))->days;
                $endOfYearDate1 = preg_split('/-/', $date)[0].'-12-31';
                $dateOffsetPct = ($dayOffset/365.00/($this->yearInterval*$this->numBoxes));
                
                
                //echo("$date, $value    $dayOffset $dateOffsetPct <br/>");
                $dateOffsetPercentage = number_format($dateOffsetPct, 2);
            }
            else if ($this->numMonths > 0)
            {   
                $ymd = preg_split('/-/', $this->endDate);
                $y = $ymd[0];
                $m = $ymd[1];
                $lastDay = date('t', strtotime($this->endDate));
                $end = new \DateTime($y."-".$m."-".$lastDay);   
                $numDays = $end->diff($date0)->days;
                    
             
                $dateOffsetPct = ($dayOffset / ($numDays));
                $dateOffsetPercentage = number_format($dateOffsetPct, 2);    
            }
            else if ($this->numDays > 0)
            {           
                $dateOffsetPct = $dayOffset / ($this->dayInterval*$this->numBoxes); 
                $dateOffsetPercentage = number_format($dateOffsetPct, 2);
                // ("$dayOffset  $this->numDays $dateOffsetPct $dateOffsetPercentage <br />");  
                $midOffset = ($labelWidthRegion/$this->numBoxes)/2;
            
            }
            else
            {
                $dateOffsetPct = $dayOffset / (30.00);
                $dateOffsetPercentage = number_format($dateOffsetPct, 2);
            }

            $dateOffset = $midOffset + $this->labelOffset + 
                          self::$offsetWaterfallX + 
                          $dateOffsetPercentage*$labelWidthRegion;
           
            $riskOffset = self::$offsetWaterfallY + self::$waterfallHeight*(1 - $value);
            
            return new Point($dateOffset, $riskOffset);
        }
        
        
        public function generateLine($category, $likelihoodStart, $consequenceStart, $likelihoodEnd, $consequenceEnd)
        {
            if ($likelihoodStart == ' ' ||  $consequenceStart == ' ' || $likelihoodEnd == ' ' || $consequenceEnd == ' ')
                return;
            
            $currentSlide = $this->riskPPT->getActiveSlide();
            
            $fromX = $this->matrix($likelihoodStart, $consequenceStart)->centerX;
            $fromY = $this->matrix($likelihoodStart, $consequenceStart)->centerY;
            
            $toX = $this->matrix($likelihoodEnd, $consequenceEnd)->centerX;
            $toY = $this->matrix($likelihoodEnd, $consequenceEnd)->centerY;
            
            
            if ($category != SCHEDULE)
            {
                $shape = $currentSlide->createLineShape($fromX, $fromY, $toX, $toY);
        
                if ($category == ACTUAL)
                {
                     
                    $color = new Color('FF000000');
              
                    $shape->getFill()
                          ->setFillType(Fill::FILL_SOLID)
                          ->setStartColor($color)
                          ->setEndColor($color);
                    $shape->getBorder()
                          ->setColor(new Color('FF000000'))
                          ->setLineStyle(Border::LINE_SINGLE);
                }               
               else
               {
                    $color = new Color('00000000');
              
                    $shape->getFill()
                          ->setFillType(Fill::FILL_NONE)
                          ->setStartColor($color)
                          ->setEndColor($color);
                    $shape->getBorder()
                          ->setColor(new Color('FF0000FF'))
                          ->setLineStyle(Border::LINE_DOUBLE);
               }
            }
            //else
            //{
                  /*$d = sqrt(pow($toY-$fromY, 2) + pow($toX-$fromX, 2));
                  if ($toX != $fromX)
                  {
                       $m = ($toY-$fromY)/($fromX-$toX);
                          $dashLen = 2;
                          for ($y = $fromY, $x = $fromX; $y < $toY || $x > $toX; $y += ((2*$dashLen*sin(atan($m)))), $x -= (2*$dashLen*cos(atan($m))))
                          {   
                              $startX = $x;
                              $startY = $y;
                              
                              $endY = $startY + (($dashLen)*sin(atan($m))); 
                              $endX = $startX - (($dashLen)*cos(atan($m))); 
                              
                              $shape = $currentSlide->createLineShape($startX, $startY, $endX, $endY);
                 
                              
                              $color = new Color('FF000000');
            
                       
                       $shape->getFill()
                             ->setFillType(Fill::FILL_SOLID)
                             ->setStartColor($color)
                             ->setEndColor($color);
                       $shape->getBorder()
                             ->setColor($color)->setLineWidth(2)
                             ->setLineStyle($this->getCategoryLine($category));  
                          } 
                  }
                  else
                  {
                  
                          $dashLen = 2;
                          for ($y = $toY; $y > $fromY; $y -= 2*$dashLen)
                          {   
                              $startX = $fromX;
                              $startY = $y;
                              $endX = $toX;
                              $endY = $y - ($dashLen);             
                              
                              $shape = $currentSlide->createLineShape($startX, $startY, $endX, $endY);
                 
                              $color = new Color('FF000000');
                               $shape->getFill()
                                     ->setFillType(Fill::FILL_SOLID)
                                     ->setStartColor($color)
                                     ->setEndColor($color);    
                               $shape->getBorder()
                                     ->setColor($color)->setLineWidth(2)
                                     ->setLineStyle(); 
                          }  
                  }  */
            //} 
            
            else
            {
                    $color = new Color('FF000000');
                    $shape = $currentSlide->createLineShape($fromX, $fromY, $toX, $toY);
                                 
                    $shape->getFill()
                         ->setFillType(Fill::FILL_SOLID)
                         ->setStartColor($color)
                         ->setEndColor($color);
                    $shape->getBorder()
                         ->setColor($color)->setLineWidth(1)
                         ->setDashStyle(Border::DASH_DASH);  
            }
        }
        public function generateWaterfallLine($category = SCHEDULE, $fromX, $fromY, $toX, $toY)
        {
            $currentSlide = $this->riskPPT->getActiveSlide();
            if ($category == ACTUAL)
            {
                 $shape = $currentSlide->createLineShape($fromX, $fromY, $toX, $fromY);          
                   $color = new Color('FF000000');
               $shape->getFill()
                     ->setFillType(Fill::FILL_SOLID)
                     ->setStartColor($color)
                     ->setEndColor($color);
               $shape->getBorder()
                     ->setColor($color)
                     ->setLineStyle();  
            } 
            else if ($category == BASELINE)
            {
                 $shape = $currentSlide->createLineShape($fromX, $fromY, $toX, $fromY);          

                     $color = new Color('FF0000FF');
               $shape->getFill()
                     ->setFillType(Fill::FILL_NONE);
               $shape->getBorder()
                     ->setColor($color)
                     ->setLineStyle(Border::LINE_DOUBLE);  
            } 
           /* else
             {
                        
                          $dashLen = 2;
                          for ($x = $fromX; $x < $toX; $x += 2*$dashLen)
                          {   
                               $startX = $x;
                              $startY = $fromY;
                              $endY = $fromY; 
                              $endX = $x + $dashLen;
                              
                              $shape = $currentSlide->createLineShape($startX, $startY, $endX, $endY);
                 
                              $color = new Color('FF000000');
                               $shape->getFill()
                                     ->setFillType(Fill::FILL_SOLID)
                                     ->setStartColor($color)
                                     ->setEndColor($color); 
                               $shape->getBorder()
                                     ->setColor($color)->setLineWidth(2)
                                     ->setLineStyle(); 
                              
                             
                                 
                          }
             }
             */
             else if ($category == SCHEDULE){
                    $color = new Color('FF000000');
                    $shape = $currentSlide->createLineShape($fromX, $fromY, $toX, $fromY);  
                                 
                    $shape->getFill()
                         ->setFillType(Fill::FILL_SOLID)
                         ->setStartColor($color)
                         ->setEndColor($color);
                    $shape->getBorder()
                         ->setColor($color)->setLineWidth(1)
                         ->setLineStyle(Border::LINE_DOUBLE)
                         ->setDashStyle(Border::DASH_DASH);  
                               
             }
             
           
              
            if ($category == ACTUAL)
            {
                 $shape = $currentSlide->createLineShape($toX, $fromY, $toX, $toY);          
                   $color = new Color('FF000000'); 
               $shape->getFill()
                     ->setFillType(Fill::FILL_NONE)
                     ->setStartColor($color)
                     ->setEndColor($color);
               $shape->getBorder()
                     ->setColor($color)
                     ->setLineStyle(Border::LINE_SINGLE);   
            }
            else if ($category == BASELINE)
            {
                 $shape = $currentSlide->createLineShape($toX, $fromY, $toX, $toY);          
                   $color = new Color('FF0000FF');
               $shape->getFill()
                     ->setFillType(Fill::FILL_NONE);
               $shape->getBorder()
                     ->setColor($color)
                     ->setLineStyle(Border::LINE_DOUBLE);  
            }  
            /*else
             {
                  
                          $dashLen = 2;
                          for ($y = $fromY+2; $y < $toY; $y += 2*$dashLen)
                          {   
                              $startX = $toX;
                              $startY = $y;
                              $endY = $y - $dashLen;
                                 
                              $shape = $currentSlide->createLineShape($startX, $startY, $startX, $endY);
                 
                              $color = new Color('FF000000');
                               $shape->getFill()
                                     ->setFillType(Fill::FILL_SOLID)
                                     ->setStartColor($color)
                                     ->setEndColor($color);
                                     
                                     
                               $thickness = 2;
                               if ($category == MARKER)
                                    $thickness = 1;
                               $shape->getBorder()
                                     ->setColor($color)->setLineWidth($thickness)
                                     ->setLineStyle(); 
                          }
            }
              */
              
              else if ($category == SCHEDULE){
              
                  $shape = $currentSlide->createLineShape($toX, $fromY, $toX, $toY);
                      $color = new Color('FF000000');                                   
                    $shape->getFill()
                         ->setFillType(Fill::FILL_SOLID)
                         ->setStartColor($color)
                         ->setEndColor($color);
                    $shape->getBorder()
                         ->setColor($color)->setLineWidth(1)
                         ->setLineStyle(Border::LINE_DOUBLE)
                         ->setDashStyle(Border::DASH_DASH);  
              }
              
              if ($category == MARKER){
                    $color = new Color('FF000000');
                    $shape = $currentSlide->createLineShape($fromX, $fromY, $toX, $toY);  
                                 
                    $shape->getFill()
                         ->setFillType(Fill::FILL_SOLID)
                         ->setStartColor($color)
                         ->setEndColor($color);
                    $shape->getBorder()
                         ->setColor($color)->setLineWidth(1)
                         ->setDashStyle(Border::DASH_SYSDOT);  
                               
             }
              
           
        }
        
        
        public function generateMatrixEventPath($events)
        {
            //Create Points (BASELINE Likelihood/Consequence)
            for ($idx = 0; $idx < count($events); $idx++)
            {
                $this->generatePoint(
                                     BASELINE, 
                                     $events[$idx]['baseline-likelihood'], 
                                     max($events[$idx]['baseline-consequence-T'], $events[$idx]['baseline-consequence-S'], $events[$idx]['baseline-consequence-C']),
                                     "b$idx"
                                    );
            }
            //Create Lines (BASELINE Likelihood/Consequence) From Points
            for ($idx = 0; $idx < count($events) - 1; $idx++)
            {
                $this->generateLine(
                                    BASELINE, 
                                    $events[$idx]['baseline-likelihood'], 
                                    max($events[$idx]['baseline-consequence-T'], $events[$idx]['baseline-consequence-S'], $events[$idx]['baseline-consequence-C']), 
                                    $events[$idx+1]['baseline-likelihood'],
                                    max($events[$idx+1]['baseline-consequence-T'], $events[$idx+1]['baseline-consequence-S'], $events[$idx+1]['baseline-consequence-C'])
                                   );
            }             
            //Create Points (Actual Likelihood/Consequence)
            for ($idx = 0; $idx < count($events); $idx++)
            {                     
                if ($events[$idx]['actual-date'] == ' ')
                     $this->generatePoint(
                                      SCHEDULE, 
                                      $events[$idx]['schedule-likelihood'], 
                                      max($events[$idx]['schedule-consequence-T'], $events[$idx]['schedule-consequence-S'], $events[$idx]['schedule-consequence-C']),
                                      "s$idx"
                                    );
                else
                $this->generatePoint(
                                      ACTUAL, 
                                       $events[$idx]['actual-likelihood'], 
                                       max($events[$idx]['actual-consequence-T'], $events[$idx]['actual-consequence-S'], $events[$idx]['actual-consequence-C']),
                                        "a$idx"
                                    ); 
                                    

            }
            //Create Lines (Actual Likelihood/Consequence) From Points
            for ($idx = 0; $idx < count($events)-1; $idx++)
            {   
                
                $e1 = 0; $e2 = 0; $l1 = 0; $l2 = 0; $s1 = 0; $s2 = 0;  
                if ($events[$idx]['actual-date'] != ' ' && $events[$idx+1]['actual-date'] == ' ')
                {
                       $this->generateLine(
                                     SCHEDULE, 
                                     $l1 = $events[$idx]['actual-likelihood'], 
                                     $e1 = max($events[$idx]['actual-consequence-T'], $events[$idx]['actual-consequence-S'], $events[$idx]['actual-consequence-C']), 
                                     $l2 = $events[$idx+1]['schedule-likelihood'], 
                                     $e2 = max($events[$idx+1]['schedule-consequence-T'], $events[$idx+1]['schedule-consequence-S'], $events[$idx+1]['schedule-consequence-C']) 
                                   );
                }                   
                else if ($events[$idx]['actual-date'] == ' ' && $events[$idx+1]['actual-date'] == ' ')
                {
                    $this->generateLine(
                                     SCHEDULE, 
                                     $l1 = $events[$idx]['schedule-likelihood'], 
                                     $e1 = max($events[$idx]['schedule-consequence-T'], $events[$idx]['schedule-consequence-S'], $events[$idx]['schedule-consequence-C']), 
                                     $l2 = $events[$idx+1]['schedule-likelihood'], 
                                     $e2 = max($events[$idx+1]['schedule-consequence-T'], $events[$idx+1]['schedule-consequence-S'], $events[$idx+1]['schedule-consequence-C']) 
                                   );
                }
                else
                {
                $this->generateLine(
                                     ACTUAL, 
                                     $l1 = $events[$idx]['actual-likelihood'], 
                                     $e1 = max($events[$idx]['actual-consequence-T'], $events[$idx]['actual-consequence-S'], $events[$idx]['actual-consequence-C']), 
                                     $l2 = $events[$idx+1]['actual-likelihood'], 
                                     $e2 = max($events[$idx+1]['actual-consequence-T'], $events[$idx+1]['actual-consequence-S'], $events[$idx+1]['actual-consequence-C']) 
                                   );
                }                  
              $idx2 = $idx+1;
             // echo "[$idx]<$l1, $e1> [$idx2]<$l2, $e2> <br />";
            }
            //die();
        }
        
        public function drawWaterfallLegends()
        {
            $this->drawWaterfallLegend(ACTUAL);
            $this->drawWaterfallLegend(SCHEDULE);
            $this->drawWaterfallLegend(BASELINE);
        }
        
        public function drawWaterfallLegend($category)
        {
            $currentSlide = $this->riskPPT->getActiveSlide();
            
            $offset = 0;
            if ($category == ACTUAL)
                $offset = 20;
            else if ($category == SCHEDULE)
                $offset = 0;
            else if ($category == BASELINE)
                $offset = -20;
                
            $startX = self::$offsetWaterfallX + self::$waterfallWidth + 20;
            $startY = self::$offsetWaterfallY + self::$waterfallHeight / 2 - $offset;
            
          
           $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(self::$eventHeight)
                                  ->setWidth(self::$eventWidth);
           
                          
            $shape->setOffsetX($startX + 25 - self::$eventWidth/2);
            $shape->setOffsetY($startY - self::$eventHeight/2);
            $color = new Color('FF'.self::$eventColor);
            
            $shape->getFill()
                  ->setFillType($this->getPointFill($category))
                  ->setStartColor($color)
                  ->setEndColor($color);
            
            $shape->getBorder()
                  ->setColor(new Color('FF000000'))
                  ->setLineStyle($this->getPointBorder($category));
                  
            
            
             //$shape = $currentSlide->createLineShape($startX , $startY , $startX + 50, $startY);          
              
                $this->generateWaterfallLine($category, $startX , $startY , $startX + 50, $startY);
                   $color = new Color('FF000000');
               $shape->getFill()
                     ->setFillType(Fill::FILL_SOLID)
                     ->setStartColor($color)
                     ->setEndColor($color);
               $shape->getBorder()
                     ->setColor($color)
                     ->setLineStyle();   
                     
        
               $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(10)
                                  ->setWidth(55);   
                                  
               $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER);       
            
            $shape->setOffsetX($startX-2);
            $shape->setOffsetY($startY-15);
            
            $text = "";
            if ($category == ACTUAL)
                $text = 'Actual';
            else if ($category == SCHEDULE)
                $text = 'Schedule';
            else if ($category == BASELINE)
                $text = 'Baseline';
                
            $textRun = $shape->createTextRun($text);
            $textRun->getFont()->setSize(6); 
            
           
        }
                                                                          
        public function generateWaterfallMarker($today)
        {                                          
            $maxY = 1;
            $p1 = $this->generateWaterfallPoint($today, $maxY);
            
            $minY = 0;
            $p2 = $this->generateWaterfallPoint($today, $minY);
            
            $this->generateWaterfallLine(MARKER, $p1->x, $p1->y, $p2->x, $p2->y);
        }
        
        
        public function generateWaterfallMarkerDate($today)
        {   
            $currentSlide = $this->riskPPT->getActiveSlide();
            $p1 = $this->generateWaterfallPoint($today, .15);
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(25)
                                  ->setWidth(70);
                                  
                                                
            $shape->setOffsetX($p1->x - 70);
            $shape->setOffsetY($p1->y);
            
            $ymd = preg_split('/-/', $today);

            $textRun = $shape->createTextRun($ymd[1].'/'.$ymd[2].'/'.$ymd[0]);      
            $textRun->getFont()->setSize(7);  
            $textRun->getFont()->setBold(true);         
                
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER);
            
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setVertical(Alignment::VERTICAL_CENTER);  
        
        }
        
        
        public function generateWaterfallEventPath($events)
        {   
            //Create Waterfall Points (BASELINE)
            $points = [];
            for ($idx = 0; $idx < count($events); $idx++)
            {
                 $likelihood = $events[$idx]['baseline-likelihood']; 
                 $consequence = max($events[$idx]['baseline-consequence-T'], $events[$idx]['baseline-consequence-S'], $events[$idx]['baseline-consequence-C']);
                 $risk = $this->getRisk($likelihood, $consequence);
                 $points[] = $this->generateWaterfallPoint(
                                                            $events[$idx]['baseline-date'], 
                                                            $risk
                                                         );
                                                
                $this->renderWaterfallPoint(BASELINE, $points[$idx], "b$idx");
            }
            
         // var_dump($points);
          
            //Create Waterfall Lines (BASELINE)
            for ($idx = 0; $idx < count($events) - 1; $idx++)
            {
                $this->generateWaterfallLine(
                                             BASELINE, 
                                             $points[$idx]->x, 
                                             $points[$idx]->y, 
                                             $points[$idx+1]->x, 
                                             $points[$idx+1]->y
                                            );
            }
            
            //Create Waterfall Points (Actual)
            $points = [];
            
            for ($idx = 0; $idx < count($events); $idx++)
            {
                if ($events[$idx]['actual-date'] == ' ')
                {
                    $likelihood = $events[$idx]['schedule-likelihood']; 
                    $consequence = max($events[$idx]['schedule-consequence-T'], $events[$idx]['schedule-consequence-S'], $events[$idx]['schedule-consequence-C']);
                    $risk = $this->getRisk($likelihood, $consequence);
                    $points[] = $this->generateWaterfallPoint(
                                                            $events[$idx]['schedule-date'],
                                                            $risk
                                                         );
                    $this->renderWaterfallPoint(SCHEDULE, $points[$idx], "s$idx");
                }
                else
                {
                    $likelihood = $events[$idx]['actual-likelihood'];
                    $consequence = max($events[$idx]['actual-consequence-T'], $events[$idx]['actual-consequence-S'], $events[$idx]['actual-consequence-C']);
                    $risk = $this->getRisk($likelihood, $consequence);
                    $points[] = $this->generateWaterfallPoint(
                                                            $events[$idx]['actual-date'], 
                                                            $risk
                                                         );
                    $this->renderWaterfallPoint(ACTUAL, $points[$idx], "a$idx");
                }
            }
            //var_dump($points);
          
            //Create Waterfall Lines (Actual)
            for ($idx = 0; $idx < count($events)-1; $idx++)
            {
                if ($events[$idx+1]['actual-date'] == ' ')
                        $this->generateWaterfallLine(
                                                SCHEDULE, 
                                                $points[$idx]->x, 
                                                $points[$idx]->y, 
                                                $points[$idx+1]->x, 
                                                $points[$idx+1]->y
                                            );
                                            
                else
                $this->generateWaterfallLine(
                                                ACTUAL, 
                                                $points[$idx]->x, 
                                                $points[$idx]->y, 
                                                $points[$idx+1]->x, 
                                                $points[$idx+1]->y
                                            );
            }
        }
        
        public function generateRiskWaterfallLevel($riskHeight, $offsetX, $offsetY, $color)
        {
            $currentSlide = $this->riskPPT->getActiveSlide();
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight($riskHeight)
                                  ->setWidth(self::$waterfallWidth);
            $shape->setOffsetX($offsetX);
            $shape->setOffsetY($offsetY);
            $shape->getFill()
                  ->setFillType(Fill::FILL_SOLID)
                  ->setStartColor(new Color('FF'. $color))
                  ->setEndColor(new Color('FF' . $color));
        }
        
        
        public function generateRiskWaterfallBorder()
        {
            $currentSlide = $this->riskPPT->getActiveSlide();  
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(self::$waterfallHeight)
                                  ->setWidth(self::$waterfallWidth);  
            $shape->getBorder()
                  ->setColor(new Color('FF000000'))
                  ->setLineStyle(Border::LINE_SINGLE);  
            
            $shape->setOffsetX(self::$offsetWaterfallX);
            $shape->setOffsetY(self::$offsetWaterfallY);
        }
        
        public function generateRiskWaterfall()
        {   
            $maxRisk = 1.0; 
            //High
            $heightHigh = self::$waterfallHeight*($maxRisk - $this->minHigh);
            $offsetX = self::$offsetWaterfallX;
            $offsetY = self::$offsetWaterfallY;
            $this->generateRiskWaterfallLevel($heightHigh, $offsetX, $offsetY, self::$red);
           
            //Med   
            $heightMed = self::$waterfallHeight*($this->minHigh - $this->maxLow);
            $offsetX = self::$offsetWaterfallX;
            $offsetY = self::$offsetWaterfallY + $heightHigh;
            $this->generateRiskWaterfallLevel($heightMed, $offsetX, $offsetY, self::$yellow);
                  
            //Low
            $heightLow = self::$waterfallHeight*($this->maxLow);
            $offsetX = self::$offsetWaterfallX;
            $offsetY = self::$offsetWaterfallY + $heightHigh + $heightMed;
            $this->generateRiskWaterfallLevel($heightLow, $offsetX, $offsetY, self::$green);        
    
        }
        
        public function generateRiskWaterfallLabelYAxis($heightRisk, $offsetRiskY, $labelText)
        {
            
            /*
               Waterfall Measurements
                           -+-                    -+- -+-     
                            |                      |   |
                            |  offsetRiskY (High)  |   |
                            |                      |   |
                         ---+---  -+-              |   offsetRiskY(Med) = offsetRiskY(High) + heightRiskHigh             --+--
                            |      |               |   |                                                                   |
      centerRiskY --------- + heightRisk (High)    |   |                                                                   |
                            |      |               |   |                                                                   |
                         ---+---  -+-              |  -+-                                                                  |
                            |      |               |                                                                       |
      centerRiskY --------- + heightRisk (Med)     offsetRiskYLow = offsetRiskYHigh + heightRiskHigh + heightRiskMed       + waterfallHeight = heightHigh + heightMed + heightLow
                            |      |               |                                                                       |
                         ---+---  -+-             -+-                                                                      |
                            |      |                                                                                       |
      centerRiskY --------- + heightRisk (Low)                                                                             |
                            |      |                                                                                       |
                         ---+---  -+-                                                                                    --+-- 
                          * 
                         / \
                          |
                          |
                          |
                          |
    halfLabelWidth  ------+
                           
                            |------heightRisk/2-----+------heightRisk/2------|  
                            +------------------------------------------------+
         halfLabelWidth     |                                                |
                            +                   Risk Label                   + 
         halfLabelWidth     |                                                |
                            +------------------------------------------------+
            */
            $halfRiskHeight = $heightRisk/2;
            $centerRiskY = $offsetRiskY + $halfRiskHeight;
            $labelWidth = self::$waterfallHeight - $centerRiskY;
            $halfLabelWidth = self::$waterfallLabelWidth/2;
            
            $currentSlide = $this->riskPPT->getActiveSlide();
           
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight($halfLabelWidth)
                                  ->setWidth($heightRisk);    //swap width, height for rotation (90 degrees)
           
           
            $shape->setOffsetX(-$halfRiskHeight);
            $shape->setOffsetY($centerRiskY + self::$offsetWaterfallY);
            $shape->setRotation(-90);
            $offsetX = $shape->getOffsetX() + self::$offsetWaterfallX - $halfLabelWidth/2;
            $offsetY = $shape->getOffsetY() - $halfLabelWidth/2;
            
            $shape->setOffsetX($offsetX);
            $shape->setOffsetY($offsetY);
            $textRun = $shape->createTextRun($labelText);      
            $textRun->getFont()->setSize(9);           
                
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER);
            
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setVertical(Alignment::VERTICAL_CENTER);    
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight($heightRisk)
                                  ->setWidth($halfLabelWidth);    //swap width, height for rotation (90 degrees)
            
            $offsetX = self::$offsetWaterfallX - $halfLabelWidth;
            $offsetY = self::$offsetWaterfallY + $offsetRiskY;
            $shape->setOffsetX($offsetX);
            $shape->setOffsetY($offsetY);
            
            $shape->getBorder()
                  ->setColor(new Color('FF000000'))
                  ->setLineStyle(Border::LINE_SINGLE);
        }
        
        public function generateRiskWaterfallLabelsYAxis()
        {                    
            $maxRisk = 1.0;
            //High
            $heightHigh = self::$waterfallHeight*($maxRisk-$this->minHigh);
            $offsetRiskHigh = 0;
            $riskTextHigh = 'High';
            $this->generateRiskWaterfallLabelYAxis($heightHigh, $offsetRiskHigh, $riskTextHigh);
           
            //Med
            $heightMed = self::$waterfallHeight*($this->minHigh-$this->maxLow);
            $offsetRiskMed = $heightHigh;
            $riskTextMed = 'Med';
            $this->generateRiskWaterfallLabelYAxis($heightMed, $offsetRiskMed, $riskTextMed);

            //Low
            $heightLow = self::$waterfallHeight*$this->maxLow;
            $offsetRiskLow = $heightHigh + $heightMed;
            $riskTextLow = 'Low';
            $this->generateRiskWaterfallLabelYAxis($heightLow, $offsetRiskLow, $riskTextLow);
        }
        
        function renderYearBoxes($yearsBetween, $yearInterval, $currentSlide, $date1, $date2)
        {            
            $idx = 0;      
            $offset = self::$waterfallWidth/(self::$maxYearsXAxis*(($yearsBetween)/($yearInterval)));
            $this->labelOffset = $offset;
            $width = self::$waterfallWidth - $offset*2;   
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(20)
                                  ->setWidth($offset);  

            $shape->setOffsetX(self::$offsetWaterfallX);
            $shape->setOffsetY(self::$offsetWaterfallY + self::$waterfallHeight);
            $shape->getBorder()
                 ->setColor(new Color('FF000000'))
                  ->setLineStyle(Border::LINE_SINGLE);
           
            $totalWidth = $shape->getWidth();
            $date = clone $date1; 
            $date2 = date_add($date2, new \DateInterval("P{$yearInterval}Y"));
            while (date_add($date, new \DateInterval("P0Y")) <= $date2)
            {
                $shape = $currentSlide->createRichTextShape()
                                      ->setHeight(20)
                                      ->setWidth($width/(($yearsBetween)/$yearInterval)); 
                                      
                $shape->setOffsetX(self::$offsetWaterfallX + ($offset) + ($idx++)*$shape->getWidth());
                $shape->setOffsetY(self::$offsetWaterfallY + self::$waterfallHeight);
                
                $textRun = $shape->createTextRun(date_format($date, 'Y')); 
                $textRun->getFont()->setSize(7);           
                
                $shape->getActiveParagraph()
                      ->getAlignment()
                      ->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $shape->getActiveParagraph()
                      ->getAlignment()
                      ->setVertical(Alignment::VERTICAL_CENTER);    
                $shape->getBorder()
                      ->setColor(new Color('FF000000'))
                      ->setLineStyle(Border::LINE_SINGLE);

                $date = date_add($date, new \DateInterval("P{$yearInterval}Y"));
            }
               
        
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(20)
                                  ->setWidth($offset);  
            $shape->setOffsetX(self::$offsetWaterfallX + $width + $offset);
            $shape->getBorder()
                  ->setColor(new Color('FF000000'))
                  ->setLineStyle(Border::LINE_SINGLE);  
            
            $shape->setOffsetX(self::$offsetWaterfallX + self::$waterfallWidth - $offset);
            $shape->setOffsetY(self::$offsetWaterfallY + self::$waterfallHeight);
            
            $this->numYears =  $yearsBetween;
            return $idx;//num boxes
        }
        
        function renderMonthBoxes($monthsBetween, $monthInterval, $currentSlide, $date1, $date2)
        {
            $idx = 0; 
            $padding = self::$waterfallWidth/(3*($monthsBetween+$monthInterval)/($monthInterval));
            $this->labelOffset = $padding;
            $width = self::$waterfallWidth - $padding*2;
            
            $shape = $currentSlide->createRichTextShape()->setHeight(20)->setWidth($padding);     
            $shape->setOffsetX(self::$offsetWaterfallX);
            $shape->setOffsetY(self::$offsetWaterfallY + self::$waterfallHeight);
            $shape->getBorder()
                  ->setColor(new Color('FF000000'))
                  ->setLineStyle(Border::LINE_SINGLE);
            $totalWidth = $shape->getWidth();
            $date = clone $date1; 
            $yearDesignator = '0000';
            
            while (date_add($date, new \DateInterval("P0M")) <= date_add($date2, new \DateInterval("P0M")))
            {   
                $shape = $currentSlide->createRichTextShape()
                                      ->setHeight(20)
                                      ->setWidth($width/floor(($monthsBetween+$monthInterval)/$monthInterval));
                $shape->setOffsetX(self::$offsetWaterfallX + $padding +  ($idx++)*$shape->getWidth());
                $shape->setOffsetY(self::$offsetWaterfallY + self::$waterfallHeight);
                
                $stringDate = date_format($date, 'M');   
                $y = date_format($date, 'Y');
                $stringDate = $stringDate . "\n$y";
                                                                                       
                $textRun = $shape->createTextRun($stringDate);
                $textRun->getFont()->setSize(7);         
                $shape->getActiveParagraph()
                      ->getAlignment()
                      ->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $shape->getActiveParagraph()
                      ->getAlignment()
                      ->setVertical(Alignment::VERTICAL_CENTER);    
                $shape->getBorder()
                      ->setColor(new Color('FF000000'))
                      ->setLineStyle(Border::LINE_SINGLE);
                            
                $date = date_add($date, new \DateInterval("P".$monthInterval."M"));
            }
               
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(20)
                                  ->setWidth($padding);  
            $shape->setOffsetX(self::$offsetWaterfallX + $width + $padding);
            $shape->getBorder()
                  ->setColor(new Color('FF000000'))
                  ->setLineStyle(Border::LINE_SINGLE);  
            
            $shape->setOffsetX(self::$offsetWaterfallX + self::$waterfallWidth - $padding);
            $shape->setOffsetY(self::$offsetWaterfallY + self::$waterfallHeight);
            $this->numMonths = $monthsBetween;
            return $idx; //num boxes                                                 
        } 
        
        function renderDayBoxes($daysBetween, $dayInterval, $currentSlide, $date1, $date2)
        {
            $idx = 0;                        
            $offset = self::$waterfallWidth/(16*$daysBetween/($dayInterval));
            $this->labelOffset = 2*$offset;
            $width = self::$waterfallWidth - $this->labelOffset;
            
             
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(20)
                                  ->setWidth($offset);
                                  
            $shape->getBorder()->setColor(new Color('FF000000'))->setLineStyle(Border::LINE_SINGLE);
            $shape->setOffsetX(self::$offsetWaterfallX);
            $shape->setOffsetY(self::$offsetWaterfallY + self::$waterfallHeight);
           
           
            $numCols = ceil($daysBetween/$dayInterval);                                                                                               
            $shape = $currentSlide->createTableShape($numCols)
                                  ->setWidth($width)
                                  ->setHeight(20);
            
            $shape->setOffsetX($offset + self::$offsetWaterfallX);
            $shape->setOffsetY(self::$offsetWaterfallY + self::$waterfallHeight);
        
            
            $row = $shape->createRow()->setHeight(20);     
           
            $shape->getBorder()
                  ->setColor(new Color('FF000000'))
                  ->setLineStyle(Border::LINE_SINGLE);
            $totalWidth = $shape->getWidth();                                           
            $date = clone $date1; 
           // $date = date_add($date, new DateInterval("P".round($dayInterval/2)."D"));
           
           
           
            
            while (date_add($date, new \DateInterval("P0D")) <= $date2)
            {                          
                $y = date_format($date, 'Y');
                $m = date_format($date, 'm');
                $d = date_format($date, 'd');
                
                
                if ($m[0] == '0')
                    $m = ltrim($m, '0');
                 
                if ($d[0] == '0')
                    $d = ltrim($d, '0');
                
                if ($daysBetween > 10)
                    $dtString = "$m/$d\n$y";
                else
                    $dtString = "$m/$d/$y";
                
                $cell = $row->nextCell();
                $cell->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                  ->setVertical(Alignment::VERTICAL_CENTER);
                $cell->createTextRun($dtString)->getFont()->setSize(5.5);                
                $date = date_add($date, new \DateInterval("P".$dayInterval."D"));
            }   
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(20)
                                  ->setWidth($offset);
                                  
            $shape->getBorder()->setColor(new Color('FF000000'))->setLineStyle(Border::LINE_SINGLE);
            
            $shape->setOffsetX(self::$offsetWaterfallX + self::$waterfallWidth - $offset);                   
            $shape->setOffsetY(self::$offsetWaterfallY + self::$waterfallHeight);
            
            $this->numDays = $daysBetween;                                 
            
            
            return $numCols; //num boxes
        }
        
        function renderSingleDayBox($currentSlide, $date1)
        {
            $width = self::$waterfallWidth;
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(20)
                                  ->setWidth($width - 1);     
            
            $shape->setOffsetX(self::$offsetWaterfallX);
            $shape->setOffsetY(self::$offsetWaterfallY + self::$waterfallHeight);
           
            $textRun = $shape->createTextRun(date_format($date1, 'm/d/Y'));
            $textRun->getFont()->setSize(8);                
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setVertical(Alignment::VERTICAL_CENTER);
            $shape->getBorder()
                  ->setColor(new Color('FF000000'))
                  ->setLineStyle(Border::LINE_SINGLE);
            $totalWidth = $shape->getWidth(); 
            return 1;
        }    
        

         
        function generateWaterfallLabelsXAxis($first, $last, $today)
        {  
            $firstYMD = preg_split('/-/', $first);
            $lastYMD = preg_split('/-/', $last);                             
            $date1 = new \DateTime($first);
            $date2 = new \DateTime($last);
            $yearsBetween = date_diff($date2, $date1)->y;
            $monthsBetween = date_diff($date2, $date1)->m;
            $daysBetween = date_diff($date2, $date1)->days;
            
            if ($daysBetween > 31){
                $date2 = new \DateTime($lastYMD[0].'-'.$lastYMD[1].'-'.date('t', strtotime($last)));   //set date2 as end of month for date2;
                $yearsBetween = date_diff($date2, $date1)->y;
                $monthsBetween = date_diff($date2, $date1)->m;
                $daysBetween = date_diff($date2, $date1)->days;    
            }
             
            $totalMonthsBetween = $yearsBetween*12+$monthsBetween;
            $totalDaysBetween = $daysBetween; 
               
            $currentSlide = $this->getActiveSlide();
                
            $yearInterval = 0;
            $monthInterval = 0;
            $dayInterval = 0;
     
     
            $yearInterval = intval(round(ceil($yearsBetween / self::$maxYearsXAxis)));
            if ($yearsBetween > 0 && ($monthsBetween > 0 || $daysBetween > 0))
                $yearsBetween+=($yearInterval+1);
                
            $this->yearInterval = $yearInterval;
            if ($yearsBetween > $yearInterval * self::$maxYearsXAxis)
            {
                $yearInterval = round(ceil($yearsBetween+$yearInterval)/self::$maxYearsXAxis);  
                $this->yearInterval = $yearInterval;
            }
            else if ($yearsBetween <= self::$maxYearsXAxis && $yearsBetween > 1)
            {
                $yearInterval = 1;
                $this->yearInterval = $yearInterval;
            }
            else if ($yearsBetween == 0 && $monthsBetween > 1)
            {
                $monthInterval = 2;
                $dayInterval = 30 * ($monthInterval);
                $this->dayInterval = $dayInterval;  
            }
            else if ($yearsBetween == 0 && $monthsBetween <= 1)
            {
                $dayInterval = intval(floor($daysBetween / self::$maxDaysXAxis));
                $dayInterval = max(1, $dayInterval);
                $this->dayInterval = $dayInterval;
            }
     
            if ($yearsBetween >= 2)
            {
                $this->numBoxes = $this->renderYearBoxes($yearsBetween, $yearInterval, $currentSlide, $date1, $date2); 
                $this->generateWaterfallMarker($today);     
            }                                                           
            else if ($totalMonthsBetween > 1 && $totalMonthsBetween <= 18)
            {
                $monthInterval = 1;
                $this->monthInterval = $monthInterval;
                $this->numBoxes = $this->renderMonthBoxes($totalMonthsBetween, $monthInterval, $currentSlide, $date1, $date2); 
                $this->generateWaterfallMarker($today);     
            } 
            else if ($totalDaysBetween > 0)
            {  
                $this->numBoxes = $this->renderDayBoxes($totalDaysBetween+1, $dayInterval, $currentSlide, $date1, $date2); 
                $this->generateWaterfallMarker($today);
            }        
            else
            {
               $this->numBoxes =  $this->renderSingleDayBox($currentSlide, $date1); 
               $this->generateWaterfallMarker($today);
            } 
        }
        
        
        public function generateMatrixXAxisLabel()
        {
            $matrixLabelHeight = 20;
            $xAxisMatrixXOffset = self::$matrixStartX; 
            $xAxisMatrixYOffset = self::$matrixStartY + self::$matrixHeight + $matrixLabelHeight;
             
            $currentSlide = $this->riskPPT->getActiveSlide();
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(20)
                                  ->setWidth(self::$matrixHeight);    //swap width, height for rotation (90 degrees)
                
            
            $shape->setOffsetX($xAxisMatrixXOffset);
            $shape->setOffsetY($xAxisMatrixYOffset);
                        
            $textRun = $shape->createTextRun("Consequence");      
            $textRun->getFont()->setSize(9);           
            $textRun->getFont()->setBold(true);
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER);
            
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setVertical(Alignment::VERTICAL_CENTER);    
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setWidth(200)
                                  ->setHeight(20);    //swap width, height for rotation (90 degrees)
        }
        
        public function generateMatrixYAxisLabel()
        {
            $halfMatrixHeight = self::$matrixHeight/2;
             
            $currentSlide = $this->riskPPT->getActiveSlide();
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(20)
                                  ->setWidth(self::$matrixHeight);    //swap width, height for rotation (90 degrees)
                
            
            $halfMatrixHeight = self::$matrixHeight/2;
            $centerRiskY = self::$matrixStartY + $halfMatrixHeight;
            $labelWidth = self::$matrixHeight - $centerRiskY;
            $halfLabelWidth = self::$cellWidth/2;
            
            $shape->setOffsetX(self::$matrixStartX - self::$cellWidth - $halfMatrixHeight + $halfLabelWidth/2);
            $shape->setOffsetY($centerRiskY - $halfLabelWidth/2);
            $shape->setRotation(-90);
            
                        
            $textRun = $shape->createTextRun("Likelihood");      
            $textRun->getFont()->setSize(9);           
            $textRun->getFont()->setBold(true);
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER);
            
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setVertical(Alignment::VERTICAL_CENTER);    
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(200)
                                  ->setWidth($halfLabelWidth);    //swap width, height for rotation (90 degrees)
        }
 
 
 
   
        public function generateWaterfallXAxisLabel()
        {
            $waterfallLabelHeight = 20;
            $xAxisMatrixXOffset = self::$offsetWaterfallX;
            $xAxisMatrixYOffset = self::$offsetWaterfallY + self::$waterfallHeight + $waterfallLabelHeight;
             
            $currentSlide = $this->riskPPT->getActiveSlide();
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(20)
                                  ->setWidth(self::$waterfallWidth); ///swap width, height for rotation (90 degrees)
                
            
            $shape->setOffsetX($xAxisMatrixXOffset);
            $shape->setOffsetY($xAxisMatrixYOffset);
                        
            $textRun = $shape->createTextRun("Event Date");      
            $textRun->getFont()->setSize(9);           
            $textRun->getFont()->setBold(true);
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER);
            
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setVertical(Alignment::VERTICAL_CENTER);    
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setWidth(200)
                                  ->setHeight(20);    //swap width, height for rotation (90 degrees)
        }
        
        public function generateWaterfallYAxisLabel()
        {
            $halfWaterfallHeight = self::$waterfallHeight/2;
             
            $currentSlide = $this->riskPPT->getActiveSlide();
            
            $shape = $currentSlide->createRichTextShape()
                                  ->setHeight(20)
                                  ->setWidth(self::$waterfallHeight);    //swap width, height for rotation (90 degrees)
                
           
            $centerWaterfallY = self::$offsetWaterfallY + $halfWaterfallHeight;
            $labelHeight = self::$waterfallHeight;
            $halfLabelWidth = 10;
            
            $shape->setOffsetX(self::$offsetWaterfallX - $labelHeight/2 - 20 - $halfLabelWidth); //20 is Label Width
            $shape->setOffsetY($centerWaterfallY - $halfLabelWidth/2);
            $shape->setRotation(-90);
            
                        
            $textRun = $shape->createTextRun("Risk Level");      
            $textRun->getFont()->setSize(9);
            $textRun->getFont()->setBold(true);
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setHorizontal(Alignment::HORIZONTAL_CENTER);
            
            $shape->getActiveParagraph()
                  ->getAlignment()
                  ->setVertical(Alignment::VERTICAL_CENTER);    
        }
 
 
 
        public function generateRiskSummaryPresentation()
        {
           //header("Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation; charset=utf-8");
           header("charset=utf8");
           //header("Content-Disposition: attachment; filename=RiskSummary.pptx");
           $oWriterPPTX = IOFactory::createWriter($this->riskPPT,'PowerPoint2007');   
           return $oWriterPPTX->save('php://output');                                      
        }
                                                                         
        public function generateEventTable($events, $minHigh, $maxLow)
        {
            $currentSlide = $this->getActiveSlide();
            $tableShape = $currentSlide->createTableShape(18);
            $tableShape->setOffsetX(20);
            $tableShape->setOffsetY(400);
            $tableShape->setHeight(50); 
            $tableShape->setWidth(919); 
       
           
            $hdrs = [
                 '#',// => ['width'=>20, 'title'=>'#'],
                 'Title',// =>['width'=>304, 'title'=>'Event Title'],
                 'Owner',//=>['width'=>130, 'title'=>'Event Owner'],
                 'Dact' ,//=>['width'=>75, 'title'=>'Date'],
                 'Lact' ,//=> ['width'=>20, 'title'=>'L'],
                 'Tact' ,//=> ['width'=>20, 'title'=>'T'],
                 'Sact' ,//=> ['width'=>20, 'title'=>'S'],
                 'Cact' ,//=> ['width'=>20, 'title'=>'C'],
                 'Dsch' ,//=> ['width'=>75, 'title'=>'Date'],
                 'Lsch' ,//=> ['width'=>20, 'title'=>'L'],
                 'Tsch',// => ['width'=>20, 'title'=>'T'],
                 'Ssch', //=> ['width'=>20, 'title'=>'S'],
                 'Csch', //=> ['width'=>20, 'title'=>'C'],
                 'Dbas',// => ['width'=>75, 'title'=>'Date'],
                 'Lbas',// => ['width'=>20, 'title'=>'L'],
                 'Tbas',// => ['width'=>20, 'title'=>'T'],
                 'Sbas',// => ['width'=>20, 'title'=>'S'],
                 'Cbas'// => ['width'=>20, 'title'=>'C']
            ];
                         
            $headers = [
                 '#' => ['width'=>20, 'title'=>'#'],
                 'Title' =>['width'=>304, 'title'=>'Event Title'],
                 'Owner'=>['width'=>130, 'title'=>'Event Owner'],
                 'Dact' =>['width'=>75, 'title'=>'Date'],
                 'Lact' => ['width'=>20, 'title'=>'L'],
                 'Tact' => ['width'=>20, 'title'=>'T'],
                 'Sact' => ['width'=>20, 'title'=>'S'],
                 'Cact' => ['width'=>20, 'title'=>'C'],
                 'Dsch' => ['width'=>75, 'title'=>'Date'],
                 'Lsch' => ['width'=>20, 'title'=>'L'],
                 'Tsch' => ['width'=>20, 'title'=>'T'],
                 'Ssch' => ['width'=>20, 'title'=>'S'],
                 'Csch' => ['width'=>20, 'title'=>'C'],
                 'Dbas' => ['width'=>75, 'title'=>'Date'],
                 'Lbas' => ['width'=>20, 'title'=>'L'],
                 'Tbas' => ['width'=>20, 'title'=>'T'],
                 'Sbas' => ['width'=>20, 'title'=>'S'],
                 'Cbas' => ['width'=>20, 'title'=>'C']
            ];
           
            
            $row = $tableShape->createRow();
            $idx = 0;
            $color = new Color('FF0000CC');
           
            $cell = $row->nextCell();
            $cell->setWidth(20);
            $row->setHeight(16);     
             $cell->getActiveParagraph()
                       ->getAlignment()
                       ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                       ->setVertical(Alignment::VERTICAL_CENTER);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor($color)
                                                                     ->setEndColor($color);
              $cell->createTextRun('#')->getFont()->setSize(9)->setColor(new Color('ffffffff'));
              $cell->setRowSpan(2);                       
            
            
            
            $cell = $row->nextCell();
            $cell->setWidth(304);
            $cell->getActiveParagraph()
                       ->getAlignment()
                       ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                       ->setVertical(Alignment::VERTICAL_CENTER);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor($color)
                                                                     ->setEndColor($color);
            $cell->createTextRun('Event Title')->getFont()->setSize(9)->setColor(new Color('ffffffff'));
               $cell->setRowSpan(2);                      
               $cell = $row->nextCell();  
               $cell->setWidth(130);
               $cell->getActiveParagraph()
                       ->getAlignment()
                       ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                       ->setVertical(Alignment::VERTICAL_CENTER); 
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor($color)
                                                                     ->setEndColor($color);
              $cell->createTextRun('Event Owner')->getFont()->setSize(9)->setColor(new Color('ffffffff'));
                     $cell->setRowSpan(2);                   
            
               $cell = $row->nextCell();
               $cell->setWidth(155);
               $cell->setColSpan(5);
           $cell->getActiveParagraph()
                       ->getAlignment()
                       ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                       ->setVertical(Alignment::VERTICAL_BOTTOM);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor($color)
                                                                     ->setEndColor($color);
              $cell->createTextRun('Actual')->getFont()->setSize(9)->setColor(new Color('ffffffff'));
            
                
            for ($idx = 0; $idx < 5; $idx++)
            {   if ($idx == 0)
                    $cell->setWidth(75);
                else
                    $cell->setWidth(20);
                $cell = $row->nextCell();
            } 
            
            $cell->setColSpan(5);
             $cell->getActiveParagraph()
                       ->getAlignment()
                       ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                       ->setVertical(Alignment::VERTICAL_BOTTOM);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor($color)
                                                                     ->setEndColor($color);
              $cell->createTextRun('Schedule')->getFont()->setSize(9)->setColor(new Color('ffffffff'));
               
            for ($idx = 0; $idx < 5; $idx++)
            {   if ($idx == 0)
                    $cell->setWidth(75);  
                else
                    $cell->setWidth(20);
                $cell = $row->nextCell();
            }
              
               $cell->setColSpan(5);
           $cell->getActiveParagraph()
                       ->getAlignment()
                       ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                       ->setVertical(Alignment::VERTICAL_BOTTOM);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor($color)
                                                                     ->setEndColor($color);
              $cell->createTextRun('Baseline')->getFont()->setSize(9)->setColor(new Color('ffffffff'));
            for ($idx = 0; $idx < 4; $idx++)
            {   if ($idx == 0)
                    $cell->setWidth(75);
                else
                    $cell->setWidth(20);
                $cell = $row->nextCell();
            }
            $cell->setWidth(20); 
           
            $row = $tableShape->createRow();
            $row->setHeight(9);
            $idx = 0;
            $color = new Color('FF0000CC');
             
            for ($idx = 0; $idx < 18; $idx++)
            {
                $cell = $row->nextCell();
                $cell->setWidth($headers[$hdrs[$idx]]['width']);
                
                if ($idx < 3)
                    continue;
                $cell->setWidth($headers[$hdrs[$idx]]['width']);
                $cell->getActiveParagraph()
                           ->getAlignment()
                           ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                           ->setVertical(Alignment::VERTICAL_BOTTOM);
                $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor($color)
                                                                         ->setEndColor($color);           
                $cell->createTextRun($headers[$hdrs[$idx]]['title'])->getFont()->setSize(9)->setColor(new Color('ffffffff'));
                
            }
            
            $headerKeys = array_flip($hdrs);   
            for ($rowIdx = 0; $rowIdx < count($events); $rowIdx++)
            {     
                $row = $tableShape->createRow();
                $row->setHeight(9);   
                for ($idx2 = 0; $idx2 < 18; $idx2++)
                {
                    $cell = $row->nextCell();
                    $cell->getBorders()->getLeft()->setColor(new Color('FF000000'));
                    $cell->getBorders()->getTop()->setColor(new Color('FF000000'));
                    $cell->getBorders()->getRight()->setColor(new Color('FF000000'));
                    $cell->getBorders()->getBottom()->setColor(new Color('FF000000'));     
                    $cell->getActiveParagraph()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_BOTTOM);
                    
                    switch($hdrs[$idx2])
                    {  
                        case '#':
                          $cell->createTextRun($rowIdx)->getFont()->setSize(9);
                          break;
                        case 'Title':
                          $cell->createTextRun($events[$rowIdx]["title"])->getFont()->setSize(9);
                           $cell->getBorders()->getTop()->setLineWidth(0)
                                 ->setLineStyle(Border::LINE_NONE);
                             break;
                        case 'Owner':
                          $cell->createTextRun($events[$rowIdx]["owner"])->getFont()->setSize(9);
                           $cell->getBorders()->getTop()->setLineWidth(0)
                                 ->setLineStyle(Border::LINE_NONE);
                           break;
                        case 'Dact':
                          $cell->createTextRun($events[$rowIdx]["actual-date"])->getFont()->setSize(9);
                           break;
                        case 'Lact':
                          $cell->createTextRun($events[$rowIdx]["actual-likelihood"])->getFont()->setSize(9);
                          break;
                        case 'Tact':                                                                                
                          $consequence = $events[$rowIdx]["actual-consequence-T"];
                          $likelihood = $events[$rowIdx]["actual-likelihood"];
                           $cell->createTextRun($consequence)->getFont()->setSize(9);
                          $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))))
                                                                         ->setEndColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))));
                           break;
                        case 'Sact':                                                                            
                          $consequence = $events[$rowIdx]["actual-consequence-S"];
                          $likelihood = $events[$rowIdx]["actual-likelihood"];
                           $cell->createTextRun($consequence)->getFont()->setSize(9);
                          $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))))
                                                                         ->setEndColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))));
                           break;
                        case 'Cact':
                                     $consequence = $events[$rowIdx]["actual-consequence-C"];
                          $likelihood = $events[$rowIdx]["actual-likelihood"];
                           $cell->createTextRun($consequence)->getFont()->setSize(9);
                          $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))))
                                                                         ->setEndColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))));
                          break;
                        case 'Dsch':
                          $cell->createTextRun($events[$rowIdx]["schedule-date"])->getFont()->setSize(9);
                           break;
                        case 'Lsch':
                             $cell->createTextRun($events[$rowIdx]["schedule-likelihood"])->getFont()->setSize(9);
                          break;
                        case 'Tsch':
                             $consequence = $events[$rowIdx]["schedule-consequence-T"];
                          $likelihood = $events[$rowIdx]["schedule-likelihood"];
                           $cell->createTextRun($consequence)->getFont()->setSize(9);
                          $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))))
                                                                         ->setEndColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))));
                          break;
                        case 'Ssch':
                             $consequence = $events[$rowIdx]["schedule-consequence-S"];
                          $likelihood = $events[$rowIdx]["schedule-likelihood"];
                           $cell->createTextRun($consequence)->getFont()->setSize(9);
                          $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))))
                                                                         ->setEndColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))));
                          break;
                        case 'Csch':
                             $consequence = $events[$rowIdx]["schedule-consequence-C"];
                          $likelihood = $events[$rowIdx]["schedule-likelihood"];
                           $cell->createTextRun($consequence)->getFont()->setSize(9);
                          $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))))
                                                                         ->setEndColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))));
                        break;
                        case 'Dbas':
                          $cell->createTextRun($events[$rowIdx]["baseline-date"])->getFont()->setSize(9);
                           break;
                        case 'Lbas':
                          $cell->createTextRun($events[$rowIdx]["baseline-likelihood"])->getFont()->setSize(9);
                           break;
                        case 'Tbas':
                          $consequence = $events[$rowIdx]["baseline-consequence-T"];
                          $likelihood = $events[$rowIdx]["baseline-likelihood"];
                           $cell->createTextRun($consequence)->getFont()->setSize(9);
                          $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))))
                                                                         ->setEndColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))));
                           break;
                        case 'Sbas':
                          $consequence = $events[$rowIdx]["baseline-consequence-S"];
                          $likelihood = $events[$rowIdx]["baseline-likelihood"];
                           $cell->createTextRun($consequence)->getFont()->setSize(9);
                          $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))))
                                                                         ->setEndColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))));
                          break;
                        case 'Cbas':                                     
                          $consequence = $events[$rowIdx]["baseline-consequence-C"];
                          $likelihood = $events[$rowIdx]["baseline-likelihood"];
                          
                          $cell->createTextRun($consequence)->getFont()->setSize(9);
                          $cell->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))))
                                                                         ->setEndColor(new Color('ff'.$this->color($this->getRisk($likelihood, $consequence))));
                           break;
                        default:
                            break;
                    }
                                                
                    $cell->setWidth($headers[$hdrs[$idx2]]['width']);
                    $idx++;
                }
                 
                $color = new Color('FF0000CC');
             
                $row->getFill()->setFillType(Fill::FILL_SOLID)
                        ->setStartColor($color)
                        ->setEndColor($color);
            }   
        } 
        
        
        public function generatePresentationTitle($team, $riskOwner, $riskState)
        {
            $currentSlide = $this->getActiveSlide();
            $tableShape = $currentSlide->createTableShape(9);
            $tableShape->setOffsetX(20);
            $tableShape->setOffsetY(80);
            $tableShape->setHeight(5);
            $tableShape->setWidth(919); 

            $headers = [
                ['width' => 40, 'title' => ''],
                ['width' => 50, 'title' => 'Team'],
                ['width' => 40, 'title' => $team],
                ['width' => 120,'title' =>  ''],
                ['width' => 120, 'title' => 'Risk Owner'],
                ['width' => 120, 'title' => $riskOwner],
                ['width' => 250, 'title' => ''],
                ['width' => 70, 'title' => 'Risk State'],
                ['width' => 110, 'title' => $riskState]
            ];                                      

            $row = $tableShape->createRow();
            $row->setHeight(5);
            $color = new Color('FF0000CC');
            $row->getFill()->setFillType(Fill::FILL_SOLID)
                            ->setStartColor( $color )
                            ->setEndColor($color);
              
           $idx = 0;
            
            $colorText = new Color('FFFFFFFF');
            for ($idx = 0; $idx < 9; $idx++)
            {
                $cell = $row->nextCell();  
                
                
                    $cell->getBorders()->getTop()->setLineWidth(0)
                                 ->setLineStyle(Border::LINE_NONE);
                                 
                     $cell->getBorders()->getLeft()->setLineWidth(0)
                         ->setLineStyle(Border::LINE_NONE);
                         
                     $cell->getBorders()->getRight()->setLineWidth(0)
                         ->setLineStyle(Border::LINE_NONE);
                         
                     $cell->getBorders()->getBottom()->setLineWidth(0)
                         ->setLineStyle(Border::LINE_NONE);        
                if ($idx == 1 || $idx == 4 || $idx == 7)
                {
                    $cell->createTextRun($headers[$idx]['title'])->getFont()->setSize(9)->setBold(true)->setColor($colorText);
                    
                }
                else
                {
                    $cell->createTextRun($headers[$idx]['title'])->getFont()->setSize(9)->setBold(true)->setColor($colorText);
                }
        
                $cell->setWidth($headers[$idx]['width']);
                $cell->getActiveParagraph()
                           ->getAlignment()
                           ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                           ->setVertical(Alignment::VERTICAL_CENTER);
            }   
        } 
        
        
    }
    
    
          
    class report {
 
        public function riskreport($id, $title, $owner, $state){
       
           $minHigh = .55;
           $maxLow = .30;
           
           $evtSvc = new \data\service\eventservice();
           $evts = [];
           $evts = $evtSvc->findAllByRisk($id);
           $events = [];
                 
            for($idx = 0; $idx < count($evts['Result']); $idx++)
            {
             
                $evt = $evts['Result'][$idx]; 
                $eventowner = ((new \data\service\userservice())->findOne($evt->eventownerid));                                      
                $events[] = [
                    'title' => $evt->eventtitle,
                    'owner' => ($eventowner) ? $eventowner['Result']->name : ' ',  
                    'baseline-date' => $evt->baselinedate ?? ' ',
                    'baseline-likelihood' => ($evt->baselinelikelihood) ?? ' ',
                    'baseline-consequence-T' => ($evt->baselinetechnical) ?? ' ',
                    'baseline-consequence-S' => ($evt->baselineschedule) ?? ' ',
                    'baseline-consequence-C' => ($evt->baselinecost) ?? ' ',
                    'actual-date' => $evt->actualdate ?? ' ',
                    'actual-likelihood' => ($evt->actuallikelihood) ?? ' ',
                    'actual-consequence-T' => ($evt->actualtechnical) ?? ' ',
                    'actual-consequence-S' => ($evt->actualschedule) ?? ' ',
                    'actual-consequence-C' => ($evt->actualcost) ?? ' ',
                    'schedule-date' => $evt->scheduledate ?? ' ',
                    'schedule-likelihood' => ($evt->scheduledlikelihood) ?? ' ',
                    'schedule-consequence-T' => ($evt->scheduledtechnical) ?? ' ',
                    'schedule-consequence-S' => ($evt->scheduledschedule) ?? ' ',
                    'schedule-consequence-C' => ($evt->scheduledcost) ?? ' '
                ];
            }
 /*   
$events = 
[
    [

        'title' => 'Risk Identification',
        'owner' => 'Jabagchourian, Vahe',
        'baseline-date' => '2019-03-01',
        'baseline-likelihood' => 5,
        'baseline-consequence-T' => 4,
        'baseline-consequence-S' => 5,
        'baseline-consequence-C' => 5,
        'actual-date' => '2019-03-01',
        'actual-likelihood' => 5,
        'actual-consequence-T' => 5,
        'actual-consequence-S' => 5,
        'actual-consequence-C' => 5,
        'schedule-date' => ' ',
        'schedule-likelihood' => ' ',
        'schedule-consequence-T' => ' ',
        'schedule-consequence-S' => ' ',
        'schedule-consequence-C' => ' '
    ],
    [
        'title' => 'Test Procedure',  
        'owner' => 'Jabagchourian, Harry',
        'baseline-date' => '2019-03-02',
        'baseline-likelihood' => 4,
        'baseline-consequence-T' => 3,
        'baseline-consequence-S' => 5,
        'baseline-consequence-C' => 5,
        'actual-date' => '2019-03-02',
        'actual-likelihood' => 4,
        'actual-consequence-T' => 4,
        'actual-consequence-S' => 5,
        'actual-consequence-C' => 3,
        'schedule-date' => ' ',
        'schedule-likelihood' => ' ',
        'schedule-consequence-T' => ' ',
        'schedule-consequence-S' => ' ',
        'schedule-consequence-C' => ' '
    ],
    [
        'title' => 'Publish Report',  
        'owner' => 'Jabagchourian, Vahe',
        'baseline-date' => '2019-03-10',
        'baseline-likelihood' => 4,
        'baseline-consequence-T' => 3,
        'baseline-consequence-S' => 4,
        'baseline-consequence-C' => 4,
        'actual-date' => '2019-03-10',
        'actual-likelihood' => 4,
        'actual-consequence-T' => 4,
        'actual-consequence-S' => 3,
        'actual-consequence-C' => 3,
        'schedule-date' => ' ',
        'schedule-likelihood' => ' ',
        'schedule-consequence-T' => ' ',
        'schedule-consequence-S' => ' ',
        'schedule-consequence-C' => ' '
    ],
    [
        'title' => 'Review Report',   
        'owner' => 'Jabagchourian, Harry',
        'baseline-date' => '2019-03-14',
        'baseline-likelihood' => 4,
        'baseline-consequence-T' => 3,
        'baseline-consequence-S' => 3,
        'baseline-consequence-C' => 3,
        'actual-date' => '2019-03-14',
        'actual-likelihood' => 3,
        'actual-consequence-T' => 2,
        'actual-consequence-S' => 3,
        'actual-consequence-C' => 4,
        'schedule-date' => ' ',
        'schedule-likelihood' => ' ',
        'schedule-consequence-T' => ' ',
        'schedule-consequence-S' => ' ',
        'schedule-consequence-C' => ' '
    ],
    [
        'title' => 'Adjustments',
        'owner' => 'Jabagchourian, Vahe',
        'baseline-date' => '2019-03-15',
        'baseline-likelihood' => 3,
        'baseline-consequence-T' => 3,
        'baseline-consequence-S' => 1,
        'baseline-consequence-C' => 2,
        'actual-date' => ' ',
        'actual-likelihood' => ' ',
        'actual-consequence-T' => ' ',
        'actual-consequence-S' => ' ',
        'actual-consequence-C' => ' ',
        'schedule-date' => '2019-03-18',
        'schedule-likelihood' => 3,
        'schedule-consequence-T' => 3,
        'schedule-consequence-S' => 1,
        'schedule-consequence-C' => 2
    ],
    [
        'title' => 'Adjustments',
        'owner' => 'Jabagchourian, Vahe',
        'baseline-date' => '2019-03-16',
        'baseline-likelihood' => 2,
        'baseline-consequence-T' => 1,
        'baseline-consequence-S' => 2,
        'baseline-consequence-C' => 1,
        'actual-date' => ' ',
        'actual-likelihood' => ' ',
        'actual-consequence-T' => ' ',
        'actual-consequence-S' => ' ',
        'actual-consequence-C' => ' ',
        'schedule-date' => '2019-03-19',
        'schedule-likelihood' => 2,
        'schedule-consequence-T' => 1,
        'schedule-consequence-S' => 2,
        'schedule-consequence-C' => 1
    ]
];
   */     
        
/*    if (isset($_GET['events']))
    {
        echo json_encode($events);
        die();
    }*/      
            $lastActualDateIdx = 0;
            for ($idx = 0; $idx < count($events); $idx++)
            {
                if ($events[$idx]['actual-date'] == ' ')
                {
                    $lastActualDateIdx = $idx-1;
                    break;
                } 
                else if($idx == count($events)-1)
                {
                    $lastActualDateIdx = $idx;
                }   
            }
    
    
            $today = date('Y-m-d');  
            $startDate = $events[0]['baseline-date'];
            $endDate = max($today, $events[count($events)-1]['baseline-date'], $events[count($events)-1]['schedule-date'], $events[$lastActualDateIdx]['actual-date']); 
            $report = new RiskReport($minHigh, $maxLow, $startDate, $endDate);
            $report->generateRiskMatrix(); 
            $report->generateRiskMatrixAxisBoxesLabels();
            $report->generateMatrixYAxisLabel();
            $report->generateMatrixXAxisLabel();
            $report->generateMatrixEventPath($events);
            $report->generateRiskWaterfall();
            $report->generateRiskWaterfallBorder();   
            $report->generateRiskWaterfallLabelsYAxis();
            $report->generateWaterfallLabelsXAxis($startDate, $endDate, $today);                                                                                              
            $report->generateWaterfallEventPath($events); 
            $report->generateWaterfallMarkerDate($today);
            $report->generateWaterfallYAxisLabel();
            $report->generateWaterfallXAxisLabel();
            $report->drawWaterfallLegends();
            $report->generateRiskPresentationTitle($id, $title);
            $report->generatePresentationTitle("SEIT", $owner, $state);
            $report->generateEventTable($events, $minHigh, $maxLow);
            $report->generateRiskSummaryPresentation();
         }
}