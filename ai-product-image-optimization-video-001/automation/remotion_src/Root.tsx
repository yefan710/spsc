import {Composition} from 'remotion';
import {
  CLEAN_SHORT_HORIZONTAL_DURATION,
  CLEAN_SHORT_HORIZONTAL_FPS,
  CleanShortHorizontalVideo,
} from './CleanShortHorizontalVideo';
import {CLEAN_SHORT_DURATION, CLEAN_SHORT_FPS, CleanShortVideo} from './CleanShortVideo';
import {DURATION as FULL_WORKFLOW_DURATION, FPS as FULL_WORKFLOW_FPS, FullWorkflowVideo} from './FullWorkflowVideo';
import {HorizontalBarsVideo} from './HorizontalBarsVideo';
import {ProductVideo} from './ProductVideo';
import {DEFAULT_PRODUCT_ID} from './productData';

export const Root = () => {
  return (
    <>
      <Composition
        component={ProductVideo}
        defaultProps={{productId: DEFAULT_PRODUCT_ID}}
        durationInFrames={810}
        fps={30}
        height={1920}
        id="ProductImageOptimizationVideo"
        width={1080}
      />
      <Composition
        component={HorizontalBarsVideo}
        defaultProps={{productId: DEFAULT_PRODUCT_ID}}
        durationInFrames={810}
        fps={30}
        height={1920}
        id="ProductImageOptimizationHorizontalBars"
        width={1080}
      />
      <Composition
        component={FullWorkflowVideo}
        defaultProps={{productId: DEFAULT_PRODUCT_ID}}
        durationInFrames={FULL_WORKFLOW_DURATION}
        fps={FULL_WORKFLOW_FPS}
        height={1920}
        id="ProductImageOptimizationFullWorkflow"
        width={1080}
      />
      <Composition
        component={CleanShortVideo}
        defaultProps={{productId: '3822609501081698334'}}
        durationInFrames={CLEAN_SHORT_DURATION}
        fps={CLEAN_SHORT_FPS}
        height={1920}
        id="ProductImageOptimizationCleanShort"
        width={1080}
      />
      <Composition
        component={CleanShortHorizontalVideo}
        defaultProps={{productId: '3822609501081698334'}}
        durationInFrames={CLEAN_SHORT_HORIZONTAL_DURATION}
        fps={CLEAN_SHORT_HORIZONTAL_FPS}
        height={1080}
        id="ProductImageOptimizationHorizontalCleanShort"
        width={1920}
      />
      <Composition
        component={CleanShortHorizontalVideo}
        defaultProps={{
          productId: '3820910710301524046',
          openingProductIds: [
            '3820910710301524046',
            '3820911041181778069',
            '3822608850243158094',
          ],
        }}
        durationInFrames={CLEAN_SHORT_HORIZONTAL_DURATION}
        fps={CLEAN_SHORT_HORIZONTAL_FPS}
        height={1080}
        id="ProductImageOptimizationHorizontalCleanShortTask4250"
        width={1920}
      />
    </>
  );
};
