#import <Cocoa/Cocoa.h>
#import <ScreenSaver/ScreenSaver.h>
#import <WebKit/WebKit.h>

@interface V8EngineSaverView : ScreenSaverView
@property(nonatomic, strong) WKWebView *webView;
@end

@implementation V8EngineSaverView

- (instancetype)initWithFrame:(NSRect)frame isPreview:(BOOL)isPreview {
    self = [super initWithFrame:frame isPreview:isPreview];
    if (!self) return nil;

    self.animationTimeInterval = 1.0 / 60.0;
    self.wantsLayer = YES;
    self.layer.backgroundColor = [NSColor colorWithWhite:0.93 alpha:1.0].CGColor;

    WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];
    configuration.preferences.javaScriptCanOpenWindowsAutomatically = NO;
    self.webView = [[WKWebView alloc] initWithFrame:self.bounds configuration:configuration];
    self.webView.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
    self.webView.wantsLayer = YES;
    self.webView.layer.backgroundColor = [NSColor colorWithWhite:0.93 alpha:1.0].CGColor;
    [self addSubview:self.webView];

    NSBundle *bundle = [NSBundle bundleForClass:[self class]];
    NSURL *pageURL = [bundle URLForResource:@"V8Engine" withExtension:@"html"];
    if (pageURL) {
        [self.webView loadFileURL:pageURL allowingReadAccessToURL:pageURL.URLByDeletingLastPathComponent];
    }
    return self;
}

- (void)animateOneFrame {
    // The page's requestAnimationFrame loop advances the 3D engine smoothly.
}

- (BOOL)hasConfigureSheet {
    return NO;
}

@end
